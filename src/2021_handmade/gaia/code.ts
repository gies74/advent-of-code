const fs = require('fs');

const PIXEL_SCALING = 40;

//#region Classes

enum GaiaSymbol {
    VBAR = 1,
    FILLED_CIRCLE = 11
}

class SymbolInfo {
    symbolType:GaiaSymbol = GaiaSymbol.FILLED_CIRCLE;
    size=1;
}

class Geometry {
    symbolSize:number=1;
    clone(): Geometry {
        return null;
    }
}

class Point extends Geometry {
    x: number;
    y: number;
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
    toString() {
        return `${this.x} ${this.y}`;
    }
    clone(): Point {
        return new Point(this.x, this.y);
    }
}

class LineString extends Geometry {
    points: Point[];
    constructor(points) {
        super();
        this.points = points;
    }
    toString() {
        return this.points[0].toString() + "  ## " + this.points.slice(1).reverse().map(pt => pt.toString()).join("  ");
    }
    clone() {
        return new LineString(this.points.map(p => p.clone()));
    }
}

class GaiaSheet {
    name: string;
    no: number;
    sheetObjects: SheetObject[] = [];
    constructor(name) {
        this.name = name;
        this.no = GaiaObject.newId("SHEET");
    }

    registerObject(gaiaObj: GaiaObject, geometry: Geometry) {
        new SheetObject(gaiaObj, this, geometry);
    }
}

class GaiaFile {
    sheets: { [name: string]: GaiaSheet } = {};

    constructor() {
        GaiaObject.resetIdSequences();
    }

    addSheet(name: string) {
        this.sheets[name] = new GaiaSheet(name);
        return this.sheets[name];
    }

    toString() {
        let contents = "G7.15\nNETWORK\n\n[OPTIONS]\nCurrency=€\n[]\n\n";

        const sheetLines = Object.keys(this.sheets).map((shName, idx) => "#1 " + String(idx + 1) + " '" + shName + "' $00C0C0C0 0 0 0 0 0 0 0 0 0 0").join("\n");
        contents += `[SHEET]\n${sheetLines}\n[]\n\n`;

        const gaiaObjects = [...new Set(Object.values(this.sheets).reduce((all, sheet) => all.concat(sheet.sheetObjects.map(so => so.gaiaObject)), [] as GaiaObject[]))];
        //gaiaObjects.splice(gaiaObjects.length, 0, gaiaObjects.filter(go => go instanceof GaiaNodeObject).map(go => (go as GaiaNodeObject).node ))
        const objectKinds = [...new Set(gaiaObjects.map(go => go.kind))];
        const fuseIndex = objectKinds.indexOf("FUSE");
        if (fuseIndex !== 1) {
            objectKinds.splice(fuseIndex, 1);
            objectKinds.push("FUSE");
        }
        objectKinds.forEach(oKind => {
            contents += `[${oKind}]\n`;

            const kindObjs = gaiaObjects.filter(go => go.kind === oKind);
            kindObjs.forEach(ko => {
                const tagLines = ko.tagLines
                    .replace("@ID", String(ko.id))
                    .replace("@SHORTNAME", ko.shortname)
                    .replace("@LENGTH", String(ko.cableLength))
                    .replace("@NODEID1", String(ko.nodeid1))
                    .replace("@NODEID2", String(ko.nodeid2))
                    .replace("@NODEID", String(ko.nodeid))
                    .replace("@KVOLTAGE", ko.kVoltage)
                    .replace("@FUSETYPELONG", ko.fuseTypeLong)
                    .replace("@EDGESIDE", ko.fuseEdgeSide)
                    .replace("@FUSEKVOLTAGE", ko.fuseKVoltage)
                    .replace("@HOMETAGLINES", ko.homeTagLines)
                    .replace("@LOADATTRS", ko.loadAttrs);
                contents += tagLines;
                const sheetTagLine = ko.sheetTagLine;
                ko.sheetObjects.forEach(so => {
                    const sheetNo = so.gaiaSheet.no;
                    const geomString = so.geometry.toString();
                    contents += sheetTagLine
                        .replace("@SHEETNO", String(sheetNo))
                        .replace("@GEOMSTRING", geomString)
                        .replace("@NODESHAPE", so.nodeshape);
                });
            });

            contents += `[]\n\n`;
        });
        return contents;
    }
}

class SheetObject {
    gaiaObject: GaiaObject;
    gaiaSheet: GaiaSheet;
    geometry: Geometry;
    symbol:SymbolInfo;
    constructor(go: GaiaObject, gs: GaiaSheet, geom: Geometry) {
        this.gaiaObject = go;
        this.gaiaSheet = gs;
        this.geometry = geom;
        this.symbol = new SymbolInfo();

        go.sheetObjects.push(this);
        gs.sheetObjects.push(this);
    }
    get nodeshape() {
        return `${this.symbol.symbolType} $000000FF ${this.symbol.size}`;        
    }
}

class GaiaObject {
    sheetObjects: SheetObject[] = [];
    id: number;
    static idSequence: { [name: string]: number } = {};
    static lookups = {
        "objectKind": "OBJECT",
        "tagLines": "#"
    }

    getSheetGeometry(sheet:GaiaSheet): Geometry {
        return this.sheetObjects.find(so => so.gaiaSheet === sheet).geometry as Geometry;
    }

    getSheetSymbol(sheet:GaiaSheet): SymbolInfo {
        return this.sheetObjects.find(so => so.gaiaSheet === sheet).symbol;
    }

    constructor() {
        this.id = GaiaObject.newId(this.kind);
    }

    get kind() {
        return this._staticLookup["objectKind"];
    }

    get tagLines() {
        return this._staticLookup["tagLines"];
    }

    get homeTagLines() {
        return "#";
    }

    get sheetTagLine() {
        return this._staticLookup["sheetTagLine"];
    }

    get shortname() {
        return "";
    }

    get kVoltage() {
        return this._staticLookup["kVoltage"] ? this._staticLookup["kVoltage"] : "0,398";
    }

    get nodeid1() {
        return 0;
    }

    get nodeid2() {
        return 0;
    }

    get nodeid() {
        return 0;
    }

    get edgeid() {
        return 0;
    }

    get cableLength() {
        return 0;
    }

    get fuseTypeLong() {
        return "";
    }

    get fuseKVoltage() {
        return "";
    }

    get fuseEdgeSide() {
        return "";
    }

    get loadAttrs() {
        return "";
    }

    get _staticLookup() {
        return (<typeof GaiaObject | typeof GaiaNode | typeof Cable | typeof Transformer | typeof HomeNode>this.constructor).lookups;
    }

    static newId(kind) {
        if (!GaiaObject.idSequence[kind]) {
            GaiaObject.idSequence[kind] = 1;
        }
        return GaiaObject.idSequence[kind]++;
    }

    static resetIdSequences() {
        GaiaObject.idSequence = {};
    }

}

class GaiaNode extends GaiaObject {
    static lookups = {
        "objectKind": "NODE",
        "tagLines":
            "#1 @ID 45297,5251 '@SHORTNAME' '' '' @KVOLTAGE 1 '' 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING @NODESHAPE 4 0 $00000000 10 'Arial' 0 0 0 0 15 -15 -20 20 5 5\n"
    }

    edges: GaiaEdge[] = [];
    pointGeometry: Point;
    x: number;
    y: number;
    nodeObject: GaiaObject = null;
    constructor() {
        super();
    }

    computeLocNetwerk(sheet: GaiaSheet, x: number, y: number, fromEdge: GaiaEdge, withinApartment:boolean = false) {

        const forNetwerk = sheet.name === "NETWERK";
        const forMSR:boolean = sheet.name === "MSR";
        const forAptmt = sheet.name === "APPARTEMENTEN";

        const myGeometry = new Point(x, y);

        if (fromEdge && (forMSR || forNetwerk && !(fromEdge instanceof Transformer) || withinApartment)) {
            const linePoints = [];
            const feederNode = fromEdge.getOpposNode(this);
            const feederGeometry = feederNode.getSheetGeometry(sheet) as Point;
            if (!(feederNode instanceof RailNode)) {
                linePoints.push(new Point(feederGeometry.x, feederGeometry.y));
            }
            linePoints.push(new Point(feederGeometry.x, myGeometry.y));
            linePoints.push(myGeometry.clone());

            const edgeGeometry = new LineString(linePoints);
            sheet.registerObject(fromEdge, edgeGeometry);
            const parallelEdge = this.edges.filter(e => e !== fromEdge).find(e => e.n1 === fromEdge.n1 && e.n2 === fromEdge.n2);
            if (parallelEdge) {
                const pEdgeGeometry = edgeGeometry.clone();
                const s = pEdgeGeometry.points[0];
                const e = pEdgeGeometry.points[pEdgeGeometry.points.length - 1];
                pEdgeGeometry.points.splice(1, 0, new Point(s.x + PIXEL_SCALING, s.y - PIXEL_SCALING), new Point(e.x - PIXEL_SCALING, e.y - PIXEL_SCALING));
                sheet.registerObject(parallelEdge, pEdgeGeometry);
            }

            fromEdge.fuses.forEach(fuse => {
                sheet.registerObject(fuse, new Point(0, 0));
            });
        }

        if (!forAptmt || this instanceof FlatkastAMNode || withinApartment) {
            sheet.registerObject(this, myGeometry);
            if (!forMSR && [HomeNode, LoadNode].find(t => this instanceof t) || this instanceof SourceNode) {
                const nodeObjGeom = new Point(x + 25, y - 25);
                sheet.registerObject((this as GaiaNode).nodeObject, nodeObjGeom);
            }
        }

        const oppSegs = this.getOpposCables(fromEdge);
        
        if ((forNetwerk || withinApartment) && oppSegs.length === 0 || forNetwerk && this instanceof FlatkastAMNode || forMSR && fromEdge && fromEdge.n1 instanceof RailNode) {
            return 1;
        }

        let dy = 0;
        oppSegs.forEach(s => {
            const length = forMSR || s instanceof Transformer ? 10 : s instanceof Link ? 4 : (s as Cable).length;
            dy += s.getOpposNode(this).computeLocNetwerk(sheet, x + PIXEL_SCALING * length, y + PIXEL_SCALING * 4 * dy, s,  withinApartment || s.n2 instanceof FlatkastNode);
        }, this);

        return dy;
    }

    getOpposCables(cab: GaiaEdge = null) {
        const edges = this.edges.filter(s => s !== cab);
        if (edges.length == 2 && edges[0].n2 === edges[1].n2) {
            edges.splice(1, 1);
        }
        if (cab) {
            const returnIdx = edges.findIndex(edge => cab.n1 === edge.n1);
            if (returnIdx !== -1) {
                edges.splice(returnIdx, 1);
            }
        }
        return edges;
    }
}

class RailNode extends GaiaNode {

}

class SourceNode extends GaiaNode {
    static lookups = {
        "objectKind": "NODE",
        "tagLines":
            "#1 @ID 45297,5251 '' '' '' @KVOLTAGE 1 '' 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING 11 $000000FF 1 4 0 $00000000 10 'Arial' 0 0 0 0 0 -110 -20 20 5 5\n",
        "kVoltage": "10,5"
    }

    constructor() {
        super();
        this.nodeObject = new Source(this);
    }
}

class LoadNode extends GaiaNode {
    constructor(aansluitwaarde: number = 250) {
        super();
        this.nodeObject = new Load(this, aansluitwaarde);
    }
}

class HomeNode extends GaiaNode {
    constructor(homeKind) {
        super();
        this.nodeObject = new Home(this, homeKind);
    }
}

interface IReconstructable {
    parameters: any[];
    reconstruct(): void;
}

class FlatkastAMNode extends GaiaNode implements IReconstructable {
    parameters: any[] = [];

    reconstruct() {
        const nApartments = this.parameters[0] as number;
        const nStories = this.parameters[1] as number;
        const feedCable = new Cable(this, 10);
        const flatKast = new FlatkastNode();
        feedCable.n2 = flatKast;
        flatKast.edges.push(feedCable);

        const nStijgleidingen = Math.ceil(nApartments / nStories);

        for (var iStijgleiding = 0; iStijgleiding < nStijgleidingen; iStijgleiding++) {
            let prevNode = flatKast;
            for (var iApartment = iStijgleiding * nStories; iApartment < Math.min(nApartments, (iStijgleiding + 1) * nStories); iApartment++) {
                const cable = new Cable(prevNode, 3);
                const apartment = new HomeNode('A');
                cable.n2 = apartment;
                apartment.edges.push(cable);
                if (prevNode === flatKast) {
                    new Fuse(cable, flatKast, "0,4", "gG 80 A");
                }
                prevNode = apartment;
            }
        }

    }

}

class FlatkastNode extends GaiaNode {

}

class GVNode extends LoadNode implements IReconstructable {
    parameters: any[] = [];
    reconstruct() {
        const nAansluitwaarde = this.parameters[0] as number;
        const numKabels = this.parameters[1] as number;
        if (this.edges.length !== 1 || !(this.edges[0].n1 instanceof RailNode) || ![160, 250].includes(nAansluitwaarde) || ![1, 2].includes(numKabels)) {
            throw "GV must be first and only node after LS rek";
        }
        (this.nodeObject as Load).aansluitWaarde = nAansluitwaarde;
        const feedCable = this.edges[0];
        if (numKabels == 2) {
            const link = new Link(feedCable.n1);
            const splitter = new RailNode();
            link.n2 = splitter;
            splitter.edges.push(link);
            const fi = link.n1.edges.indexOf(feedCable);
            link.n1.edges.splice(fi, 1);

            feedCable.fuses.splice(0, feedCable.fuses.length);
            feedCable.n1 = splitter;
            splitter.edges.push(feedCable);
            const secondCable = new Cable(splitter, feedCable.cableLength);
            secondCable.n2 = this;
            this.edges.push(secondCable);
        }

        const infeedLink = new Link(this);
        const infeedNode = new LoadNode(nAansluitwaarde);
        infeedLink.n2 = infeedNode;
        infeedNode.edges.push(infeedLink);

        infeedNode.nodeObject = new Load(infeedNode, -1 * nAansluitwaarde);
    }
}

class KVNode extends GaiaNode implements IReconstructable {
    parameters: any[] = [];
    reconstruct() { }
}


class EMof extends GaiaNode {

    get shortname() {
        return "EM";
    }
}

class AMof extends GaiaNode {

    get shortname() {
        return "AM";
    }
}

class GaiaEdge extends GaiaObject {
    n1: GaiaNode;
    n2: GaiaNode;
    fuses: Fuse[] = [];

    constructor(n1: GaiaNode) {
        super();
        this.n1 = n1;
        n1.edges.push(this);

        if (n1 instanceof RailNode) {
            new Fuse(this, n1, "0,4", "gFF 250 A");
        }

    }

    get nodeid1() {
        return this.n1.id;
    }
    get nodeid2() {
        return this.n2.id;
    }
    get edgeid() {
        return this.id;
    }

    getOpposNode(n: GaiaNode) {
        return n === this.n1 ? this.n2 : this.n1;
    }
}

class Transformer extends GaiaEdge {
    static lookups = {
        "objectKind": "TRANSFORMER",
        "tagLines":
            "#1 @ID 45297,5262 @NODEID1 @NODEID2 '' 1 1 1 1 1 1 1 1 1 1 '' '' 0 'Norm 630 kVA (5)' 1 1 2 3 0 0 2  0 0,398 0 0 0 0 1 -100 0,398 100 0,398\n" +
            "#2 '630 kVA' 0,63 10,75 0,42 4 5,2 0,745 17,321 0,0019 0,011 21,6 D YN 5 1 0,25 5 3 1 0 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 6  -15 6  0 24  -20 20  0 5  0 0 # @GEOMSTRING\n"
    }
}

class Link extends GaiaEdge {
    static lookups = {
        "objectKind": "LINK",
        "tagLines":
            "#1 @ID 0 @NODEID1 @NODEID2 '' 1 1 1 1 1 1 1 1 1 1 '' '' 0 1 1 1 1 1 1 1 1 \n",
        "sheetTagLine":
            "#9 @SHEETNO $000000FF 1 1 0  $00000000 8 'Arial' 0 0 0 -15 6  -15 6  4 0  -20 20  0 5  0 0 # @GEOMSTRING\n"
    }

}

class Cable extends GaiaEdge {
    static lookups = {
        "objectKind": "CABLE",
        "tagLines":
            "#1 @ID 45297,528 @NODEID1 @NODEID2 '' 1 1 1 1 1 1 1 1 1 1 '' '' 0,025 0 0 0 1000 0 1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9 1 1 1 1 1 1 1 1 '' '' '' '' \n" +
            "#2 @LENGTH '4*150 VVMvKhsas50/Alk 4*6' \n" +
            "#3 '150 Al; 6' 0,75 0 0,72 0,43 225 0,5 290 0,75 260 1 240 8,5 20 55 160 50 0,25692 0,79626 0,0517 0,72746 0,0496 0,70572 0,39761 0,69944 0,05103 0,70029 2,9485 0,89397 0,05386 0,7488 0,04866 0,698 0,04937 0,70422 0,04678 0,68292 0,05103 0,70026 200 6 52 1,05 1 \n",
        "sheetTagLine":
            "#9 @SHEETNO $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 6  -15 6  0 4  -20 20  5 0  0 0 # @GEOMSTRING\n"
    }
    length: number;
    constructor(n: GaiaNode, length: number = 0) {
        super(n);
        this.length = length;
    }

    get cableLength() {
        return this.length;
    }
}

class Fuse extends GaiaObject {
    static lookups = {
        "objectKind": "FUSE",
        "tagLines":
            "#1 @ID 45297,5264 ''       @EDGESIDE 1 '@FUSETYPELONG' \n",
        "sheetTagLine":
            "#9 @SHEETNO 0 0 $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 -6  0 0\n"
    }
    edge: GaiaEdge;
    node: GaiaNode;
    _kVoltage: string;
    _fuseTypeLong: string;
    constructor(edge, node, kVoltage, fuseTypeLong) {
        super();
        this.edge = edge;
        this.node = node;
        this.edge.fuses.push(this);
        this._kVoltage = kVoltage;
        this._fuseTypeLong = fuseTypeLong;
    }

    get fuseKVoltage() {
        return this._kVoltage;
    }

    get fuseEdgeSide() {
        const prefix = this.edge instanceof Transformer ? "T" : this.edge instanceof Cable ? "K" : "I";
        const side = this.edge.n1 === this.node ? 1 : 2;
        return `${prefix}${this.edge.id} ${side}`;
    }

    get fuseTypeLong() {
        return this._fuseTypeLong;
    }
}

class Frame extends GaiaObject {
    static lookups = {
        "objectKind": "FRAME",
        "tagLines":
            "#1 @ID 45297,5251 'MV' '' '' 10,5 1 '' 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 6  -15 6  0 24  -20 20  0 5  0 0 # @GEOMSTRING\n"
    }
}

class GaiaNodeObject extends GaiaObject {
    node: GaiaNode;
    constructor(node) {
        super();
        this.node = node;
    }

    get nodeid() {
        return this.node.id;
    }
}

class Home extends GaiaNodeObject {
    static lookups = {
        "objectKind": "HOME",
        "tagLines":
            "#1 @NODEID @ID 45297,5286 '' 1 1 1 1 '' 1 1 2 3 12 '4*  6 Cu Aansluitk' '' 1 1 0 10 1 'Automaat c25' '' 4 0 '' 0 0 0 0 '' '' '' \n" +
            "#2 '6Cu+6' 0,75 0 0,2 0,139 43 0,5 61 0,75 58 1 56 0,8 20 90 160 50 3,12935 0,85632 0,04935 0,76295 0,04935 0,74112 3,12935 0,72974 0,043803 0,73175 0 0 0 0 0 0 0 0 0 0 0 0 21 1,7 0 0 1 \n" +
            "#3 'Caut 25 A' 0,5 25 39 1000 42 500 48 200 56 100 70 50 110 20 193 10 250 5 250 2 250 1 250 0,5 250 0,2 250 0,1 265 0,05 635 0,02 12500 0,01 \n" +
            "@HOMETAGLINES" +
            "#19 0,05 0 0,1 93 0,2 95 0,3 96 1 97\n",
        "homeTagLines": {
            "V":
                "#12 1 0 0 0 'SA vrijstaande woning'  \n" +
                "#13 0,9 4300 0,2532 0,0335 0 0 0 0  \n" +
                "#16 1 2 4 175 0,9 0  \n" +
                "#27 0 0 1260  \n" +
                "#18 1000 0 0,0073 180 30 0 180 30 0 180 30 0,0073 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0  \n",
            "W":
                "#12 1 0 0 0 'SA 2-onder-1kap-woning' \n" +
                "#13 0 0 0 0 0 0 0 0  \n" +
                "#16 1 2 3 175 0,9 0  \n" +
                "#27 0 0 1246  \n" +
                "#18 1000 0 0,0058 180 30 0 180 30 0 180 30 0,0058 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0  \n",
            "H":
                "#12 1 0 0 0 'SA hoekwoning'  \n" +
                "#13 0,9 3300 0,2532 0,0335 0 0 0 0  \n" +
                "#16 1 2 2 150 0,9 0  \n" +
                "#27 0 0 854  \n" +
                "#18 1000 0 0,0048 180 30 0 180 30 0 180 30 0,0048 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0  \n",
            "T":
                "#12 1 0 0 0 'SA tussenwoning'  \n" +
                "#13 0,9 3200 0,2532 0,0335 0 0 0 0  \n" +
                "#16 1 2 1 125 0,9 0  \n" +
                "#27 0 0 770  \n" +
                "#18 1000 0 0,0044 180 30 0 180 30 0 180 30 0,0044 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0  \n",
            "A":
                "#12 1 0 0 0 'SA appartement' \n" +
                "#13 0,9 2300 0,2532 0,0335 0 0 0 0 \n" +
                "#16 1 2 5 100 0,9 0 \n" +
                "#27 0 0 280 \n" +
                "#18 1000 0 0,0012 180 30 0 180 30 0 180 30 0,0012 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 0 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0 \n",
        },
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING $000000FF 1 1 0 $00000000 10 'Arial' 0 0 0 7 -12  0 25  5 5  0\n",
    };
    homeKind: string;
    constructor(node, homeKind) {
        super(node);
        this.homeKind = homeKind;
    }
    get homeTagLines() {
        return this._staticLookup["homeTagLines"][this.homeKind];
    }
}

class Load extends GaiaNodeObject {
    aansluitWaarde: number;
    static lookups = {
        "objectKind": "LOAD",
        "tagLines":
            "#1 @NODEID 1 0 @LOADATTRS 0 0 0 0 0 0 0 0 0 '' 0 0 \n",
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING $00000000 1 1 0 $00008000 8 'Arial' 0 0 0 12 6  145 0  -5 -5  0\n"
    }
    constructor(n: GaiaNode, aansluitWaarde: number) {
        super(n);
        this.aansluitWaarde = aansluitWaarde;
    }
    get loadAttrs() {
        let loadType = (this.aansluitWaarde > 0) ? "BELASTING" : "OPWEK";
        const PQvals = {
            "160": "0,028 0,01735 0,028 0,01735 0,028 0,01735",
            "-160": "-0,03334 0 -0,03334 0 -0,03334 0",
            "250": "0,04534 0,02809921 0,04534 0,02809921 0,04534 0,02809921",
            "-250": "-0,05334 0 -0,05334 0 -0,05334 0"
        }[String(this.aansluitWaarde)];

        return `'${loadType}' 1 1 1 1 '' ${PQvals}`;
    }
}

class Source extends GaiaNodeObject {
    static lookups = {
        "objectKind": "SOURCE",
        "tagLines":
            "#1 @NODEID @ID 45297,5266 '' 1 1 1 0 '' 10,025 10,975 10,5 75 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING $000000FF 1 1 0 $00000000 10 'Arial' 0 0 0 -15 6  -125 0  5 5  0\n"
    }
}


class Kabel {
    verbinding: Verbinding;
    start: GaiaNode;
    constructor(start: GaiaNode, verbinding: Verbinding) {
        this.verbinding = verbinding;
        verbinding.kabels.push(this);
        this.start = start;
    }
}


class Verbinding {
    avp: AVP;
    kabels = [];
    moffen = [];
    constructor(avp: AVP) {
        this.avp = avp;
        avp.verbindingen.push(this);
    }
}

class AVP {
    verbindingen = [];
    trafo: Transformer;
    constructor() {
        const ms = new SourceNode();
        const rail = new RailNode();
        this.trafo = new Transformer(ms);
        this.trafo.n2 = rail;
        rail.edges.push(this.trafo);

        new Fuse(this.trafo, ms, "10", "PATR Trafo 630 kVA H");
        new Fuse(this.trafo, rail, "0,4", "PATR Trafo 630 kVA L");
    }

    computePresentation(sheet: GaiaSheet) {

        const forMSR:boolean=sheet.name === "MSR";
        const forAptmt = sheet.name === "APPARTEMENTEN";

        const startNode = forMSR ? this.ms : this.rail;
        const startEdge = forMSR ? null : this.trafo;
        const depth = startNode.computeLocNetwerk(sheet, 0, 0, startEdge);

        if (forAptmt) {
            return;
        }

        const railGeom = this.rail.getSheetGeometry(sheet) as Point;
        railGeom.y = (depth - 1) * 2 * PIXEL_SCALING;  // 160
        const railSymbol = this.rail.getSheetSymbol(sheet);
        railSymbol.size = 2 + (depth - 1) * 8;  // 2 + 2 * 10 = 18
        railSymbol.symbolType = GaiaSymbol.VBAR;

        if (forMSR)
        {
            const sourceNodeGeom = this.ms.getSheetGeometry(sheet) as Point;
            sourceNodeGeom.y = railGeom.y;
            const sourceGeom = this.ms.nodeObject.getSheetGeometry(sheet) as Point;
            sourceGeom.x = sourceNodeGeom.x - 20;
            sourceGeom.y = sourceNodeGeom.y;
            (this.trafo.getSheetGeometry(sheet) as LineString).points = [sourceNodeGeom, railGeom];
        }
    }

    get rail() {
        return this.trafo.n2 as RailNode;
    }

    get ms() {
        return this.trafo.n1 as SourceNode;
    }
}

class GaiaLocation {
    x: number = 0;
    y: number = 0;
}
//#endregion

//#region Parsers

const parseParams = (line: string[], object: IReconstructable) => {
    let c;
    let number = 0;
    let parsingNumber = false;
    while (c = line.shift()) {
        if (/\d/.test(c)) {
            parsingNumber = true;
            number = number * 10 + parseInt(c);
        } else {
            if (parsingNumber) {
                object.parameters.push(number);
            }
            parsingNumber = false;
            number = 0;
            if (/;/.test(c)) {
                continue;
            } else if (!/\}/.test(c)) {
                object.parameters.push(c);
            } else {
                return;
            }
        }
    }
};

const parseKabel = (line: string[], node: GaiaNode, verbinding: Verbinding) => {
    let c;
    const kabel = new Kabel(node, verbinding);
    let segment = new Cable(node);
    let m = new AMof();
    let gvVerbinding = false;
    while (c = line.shift()) {
        if (/\d/.test(c)) {
            segment.length = 10 * segment.length + parseInt(c);
        } else if (/[THVW]/.test(c)) {
            const h = new HomeNode(c);
            segment.n2 = h;
            h.edges.push(segment);
            segment = new Cable(h);
        } else if (/[FKG]/.test(c)) {
            const flg = { "F": new FlatkastAMNode(), "K": new KVNode(), "G": new GVNode() }[c];
            segment.n2 = flg;
            flg.edges.push(segment);
            if (line.shift() !== "{") {
                throw "(F)latkast, (K)V and (G)V must be followed by parameters";
            };
            parseParams(line, flg);
            flg.reconstruct();
            gvVerbinding = c === "G";
            if (gvVerbinding) {
                continue;
            }
            segment = new Cable(flg);
        } else if (c === "(") {
            if (!segment.n2) {
                segment.n2 = m;
                m.edges.push(segment);
            }
            parseKabel(line, m, verbinding);
        } else if (c === ")") {
            if (m.edges.length >= 2 || gvVerbinding)
                return;
            m = new EMof();
            segment.n2 = m;
            m.edges.push(segment);
            return;
        } else {
            throw "Error kabel";
        }
    }
};

const parseVerbinding = (line, avp: AVP) => {
    let c;
    const verbinding = new Verbinding(avp);
    parseKabel(line, verbinding.avp.trafo.n2, verbinding);
};

const parseAVP = (line) => {
    let c;
    const avp = new AVP();
    while (c = line.shift()) {
        switch (c) {
            case "(":
                parseVerbinding(line, avp);
            case ")":
                continue;
            default:
                throw "Error AVP";
        }
    }

    return avp;
};
//#endregion

const writeToFile = async (text, localDataPath) => {
    return new Promise(attemptComplete => {
        try {
            fs.writeFile(localDataPath, text, () => {
                console.info('[INFO] File write succesful');
                attemptComplete(null);
            });
        } catch {
            console.warn('[WARN] File write failed');
            attemptComplete(null);
        }
    });
};

const configs = [
    "(30G{160;1})(30G{250;2})(10(10(5(5V5V5V5V5V1))))(10(10(5(5W5W5W5W5W1))))(10(10(5(5H5T5T5T5H1)(5H5T5T5T5H1))))(10(10(5(5F{13;3}1))))"
    //, "(50(50(50(45(5V5V5V5V5V1)))))(50(50(50(45(5W5W5W5W5W1)))))(50(50(50(45(5H5T5T5T5H1)(5H5T5T5T5H1)))))"
    //, "(5V1)(5W1)(5H1)(5T1)"
    // , "(5(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1))(5(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1))"
    // , "(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)"
]
configs.forEach(async config => {

    const avp = parseAVP(config.split(''));

    const file = new GaiaFile();

    const netwerkSheet = file.addSheet("NETWERK");
    avp.computePresentation(netwerkSheet);

    const msrSheet = file.addSheet("MSR");
    avp.computePresentation(msrSheet);

    const apartmentSheet = file.addSheet("APPARTEMENTEN");
    avp.computePresentation(apartmentSheet);

    const fileContents = file.toString();
    await writeToFile(fileContents, `./data/${config}.gnf`);
});
const x = 2;
