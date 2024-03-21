const fs = require('fs');
const { cacheTypes } = require('./Types');

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

        const sheetLines = Object
            .keys(this.sheets)
            .filter(s => {
                return this.sheets[s].sheetObjects.length > 0;
            }, this)
            .map((shName, idx) => "#1 " + String(idx + 1) + " '" + shName + "' $00C0C0C0 0 0 0 0 0 0 0 0 0 0")
            .join("\n");
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
                let homeTag3 = "", homeTag2 = "";
                if (ko.aansluitwaarde) {
                    homeTag2 = typeCache["cables"][`${ko.aansluitkabelDiam}Cu+${ko.aansluitkabelDiam}`];               
                    homeTag3 = typeCache["fuses"][ko.aansluitwaarde];               
                }
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
                    .replace("@HOMESOORT", String(ko.homeSoort))
                    .replace(/@AANSLUITWAARDE/g, String(ko.aansluitwaarde))
                    .replace("@HOME_TAG3", homeTag3)
                    .replace("@HOME_TAG2", homeTag2)
                    .replace(/@AANSLUITKABELDIAM/g, String(ko.aansluitkabelDiam))
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

    get homeSoort() {
        return 0;
    }

    get aansluitkabelDiam() {
        return 0;
    }

    get aansluitwaarde() {
        return 0;
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

    dropEdge(edge) {
        const idxHere = this.edges.indexOf(edge);
        this.edges.splice(idxHere, 1);
        const oppNode = edge.getOpposNode(this);
        const idxThere = oppNode.edges.indexOf(edge);
        oppNode.edges.splice(idxThere, 1);
    }

    computeLocNetwerk(sheet: GaiaSheet, x: number, y: number, fromEdge: GaiaEdge, withinApartment:boolean = false) {

        const forNetwerk = sheet.name === "NETWERK";
        const forMSR:boolean = sheet.name === "MSR";
        const forAptmt = sheet.name === "APPARTEMENTEN";
        
        if (forAptmt && this instanceof FlatkastAMNode) {
            x = 0;
        }

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
        
        if ((forNetwerk || withinApartment) && oppSegs.length === 0 || forMSR && fromEdge && fromEdge.n1 instanceof RailNode) {
            return 1;
        }

        let dy = 0;
        oppSegs.forEach(s => {
            if (forNetwerk && s.n2 instanceof FlatkastNode)
                return;
            const length = forMSR || s instanceof Transformer ? 10 : s instanceof Link ? 4 : (s as Cable).length;
            const goingIntoApartment = forAptmt && s.n2 instanceof FlatkastNode;
            const nx = x + PIXEL_SCALING * length;
            const ny = y + PIXEL_SCALING * 4 * dy;
            dy += s.getOpposNode(this).computeLocNetwerk(sheet, nx, ny, s, withinApartment || goingIntoApartment);
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

type HeldObject = Home | Load | Source;

interface IObjectHolder {
    nodeObject: HeldObject
}

class SourceNode extends GaiaNode implements IObjectHolder {
    nodeObject: HeldObject;
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

class LoadNode extends GaiaNode implements IObjectHolder {
    nodeObject: HeldObject;
    constructor(aansluitwaarde: number = 250) {
        super();
        this.nodeObject = new Load(this, aansluitwaarde);
    }
}

class HomeNode extends GaiaNode implements IObjectHolder {
    nodeObject: HeldObject;
    constructor(homeKind, taglines="") {
        super();
        this.nodeObject = new Home(this, homeKind, taglines);
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
        const nAanlooplengte = this.parameters[2] as number;
        const aansluitwaardeI =(this.parameters.length > 2) ? this.parameters[3] as number : -1;

        const flatKast = new FlatkastNode();
        const feedCable = new Cable(this, flatKast, 10);

        const nStijgleidingen = Math.ceil(nApartments / nStories);

        for (var iStijgleiding = 0; iStijgleiding < nStijgleidingen; iStijgleiding++) {
            let prevNode = flatKast;
            for (var iApartment = iStijgleiding * nStories; iApartment < Math.min(nApartments, (iStijgleiding + 1) * nStories); iApartment++) {
                const bFirstStijgleiding = prevNode === flatKast
                const apartment = new HomeNode('A');
                const cable = new Cable(prevNode, apartment, bFirstStijgleiding ? nAanlooplengte : 3);
                if (bFirstStijgleiding) {
                    new Fuse(cable, flatKast, "0,4", "gG 80 A");
                }
                prevNode = apartment;
            }
        }
        // CVZ KV is present
        if (aansluitwaardeI > 0) {
            const taglines = Home.computeTag11(aansluitwaardeI);
            const cvzKv = new HomeNode('O', taglines);
            new Cable(flatKast, cvzKv, 3);
            const home = cvzKv.nodeObject as Home;
            home._aansluitkabelDiam = 16;
            home._aansluitwaarde = 50;
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
        if (numKabels == 2) {
            const feedCable = this.edges[0];
            this.dropEdge(feedCable);            
            const splitter = new RailNode();
            const link = new Link(feedCable.n1, splitter);

            new Cable(splitter, this, feedCable.cableLength);
            new Cable(splitter, this, feedCable.cableLength);
        }

        const infeedNode = new LoadNode(-1 * nAansluitwaarde);
        new Link(this, infeedNode);
    }
}

class KVNode extends GaiaNode implements IReconstructable {
    parameters: any[] = [];
    reconstruct() { 
        const soortObject = this.parameters[0] as string;
        new Home(this, "O", "#27 0,0251 0 5000\n", soortObject === "L" ? 3 : 1);
    }    
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

    constructor(n1: GaiaNode, n2:GaiaNode) {
        super();
        this.n1 = n1;
        this.n2 = n2;
        n1.edges.push(this);
        n2.edges.push(this);

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
    constructor(start: GaiaNode, end:GaiaNode, length: number = 0) {
        super(start, end);
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
            "#1 @NODEID @ID 45297,5286 '' 1 1 1 1 '' 1 1 2 3 12 '4* @AANSLUITKABELDIAM Cu Aansluitk' '' 1 1 0 10 1 'Automaat c@AANSLUITWAARDE' '' 4 @HOMESOORT '3 x @AANSLUITWAARDE A' 0 0 0 0 '' '' '' \n" +
            "@HOME_TAG2 \n" +
            "@HOME_TAG3 \n" +
            "#7 0 0 \n" +
            "@HOMETAGLINES" +
            "#8 ''='' \n",

        "homeTagLines": {
            "V":
                "#12 1 0 0 0 'SA vrijstaande woning'  \n" +
                "#13 0,9 4300 0,2532 0,0335 0 0 0 0  \n" +
                "#16 1 2 4 175 0,9 0  \n" +
                "#27 0 0 1260  \n" +
                "#18 1000 0 0,0073 180 30 0 180 30 0 180 30 0,0073 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0  \n" +
                "#19 0,05 0 0,1 93 0,2 95 0,3 96 1 97\n",
            "W":
                "#12 1 0 0 0 'SA 2-onder-1-kap-woning' \n" +
                "#13 0 0 0 0 0 0 0 0  \n" +
                "#16 1 2 3 175 0,9 0  \n" +
                "#27 0 0 1246  \n" +
                "#18 1000 0 0,0058 180 30 0 180 30 0 180 30 0,0058 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0  \n" +
                "#19 0,05 0 0,1 93 0,2 95 0,3 96 1 97\n",
            "H":
                "#12 1 0 0 0 'SA hoekwoning'  \n" +
                "#13 0,9 3300 0,2532 0,0335 0 0 0 0  \n" +
                "#16 1 2 2 150 0,9 0  \n" +
                "#27 0 0 854  \n" +
                "#18 1000 0 0,0048 180 30 0 180 30 0 180 30 0,0048 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0  \n" +
                "#19 0,05 0 0,1 93 0,2 95 0,3 96 1 97\n",
            "T":
                "#12 1 0 0 0 'SA tussenwoning'  \n" +
                "#13 0,9 3200 0,2532 0,0335 0 0 0 0  \n" +
                "#16 1 2 1 125 0,9 0  \n" +
                "#27 0 0 770  \n" +
                "#18 1000 0 0,0044 180 30 0 180 30 0 180 30 0,0044 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0  \n" +
                "#19 0,05 0 0,1 93 0,2 95 0,3 96 1 97\n",
            "A":
                "#12 1 0 0 0 'SA appartement' \n" +
                "#13 0,9 2300 0,2532 0,0335 0 0 0 0 \n" +
                "#16 1 2 5 100 0,9 0 \n" +
                "#27 0 0 280 \n" +
                "#18 1000 0 0,0012 180 30 0 180 30 0 180 30 0,0012 '0,1 pu: 93 %; 1 pu: 97 %' 0 0 0 0,9 1 1,1 1 0 0 0 0 0 0 0 1 1 1 0 0 0 0 0 0 0 0 0 1,5 0 \n" +
                "#19 0,05 0 0,1 93 0,2 95 0,3 96 1 97\n",
        },
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING $000000FF 1 1 0 $00000000 10 'Arial' 0 0 0 7 -12  0 25  5 5  0\n",
    };
    _aansluitwaarde:number = 25;
    _aansluitkabelDiam:number = 6;
    homeKind: string;
    _soort:number;
    OHomeTaglines:string = "";
    constructor(node, homeKind, OHomeTaglines="", soort=1) {
        super(node);
        this.homeKind = homeKind;
        this._soort = soort;
        if (homeKind === "O" && !OHomeTaglines)
            throw "For Home type O, taglines are mandatory";
        this.OHomeTaglines = OHomeTaglines;
    }
    get homeTagLines() {
        // homeKind
        return this.homeKind !== "O" ? this._staticLookup["homeTagLines"][this.homeKind] : this.OHomeTaglines;
    }

    get homeSoort() {
        return this._soort;
    }

    get aansluitwaarde() {
        return this._aansluitwaarde;
    }

    get aansluitkabelDiam() {
        return this._aansluitkabelDiam;
    }

    static computeTag11(aansluitWaardeI, cosPhi=0.9) {
        // 
        const AC = [16,25,35,40,50,63,80];
        const rekenwaardeIndex = AC.findIndex((aw, idx) => aw <= aansluitWaardeI && aansluitWaardeI < AC[idx+1]) - 1;
        const rekenWaardeI = AC[Math.max(0, rekenwaardeIndex)];
        const U = 230;
        const S_kVA = U * rekenWaardeI / 1E3;

        const sinPhi = Math.sqrt(1 - Math.pow(cosPhi, 2));

        const P_MW = cosPhi * S_kVA / 1E3;
        const Q_kvar = sinPhi * S_kVA / 1E3;

        const roundF = (n, decimals) => Math.round(Math.pow(10, decimals) * n) / Math.pow(10, decimals);
        const P_ = String(roundF(P_MW, 5)).replace(".", ",");
        const Q_ = String(roundF(Q_kvar, 5)).replace(".", ",");
        return `#11 ${P_} ${Q_} ${P_} ${Q_} ${P_} ${Q_} 0 0 0 0 0 0 0 0 0 0 0\n`;
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
        this.trafo = new Transformer(ms, rail);
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
    line.shift(); // should be  "{"
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

const parseGV = (line: string[], railNode: RailNode, length: number) => {
    line.shift(); // the G character
    const gvNode = new GVNode();
    new Cable(railNode, gvNode, length)
    parseParams(line, gvNode);    
    gvNode.reconstruct();
    line.shift(); // the ) parenthesis character
}



const parseKabel = (line: string[], prevNode: GaiaNode, length: number) => {
    let c;

    //const kabel = new Kabel(node, verbinding);
    while (c = line.shift()) {
        if (/[ATHVWFK]/.test(c)) {
            const hfkNode = /[ATHVW]/.test(c) ? new HomeNode(c) : c === "F" ? new FlatkastAMNode() : new KVNode();
            new Cable(prevNode, hfkNode, length);
            if (/[FK]/.test(c)) {
                const fkNode = hfkNode as IReconstructable;
                parseParams(line, fkNode);
                fkNode.reconstruct();
            }
            prevNode = hfkNode;
        } else if (c === "(") {
            const mof = new AMof();
            new Cable(prevNode, mof, length);
            length = parseNumber(line);
            parseKabel(line, mof, length);
            while(line[0] === "(") {
                line.shift();
                length = parseNumber(line);
                parseKabel(line, mof, length);
            }
            if (line[0] === ")") {
                line.shift();
                break;
            }
            prevNode = mof;
        } else if (c === ")") {
            const mof = new EMof();
            new Cable(prevNode, mof, length);
            break;
        } else {
            throw "Error kabel";
        }
        length = parseNumber(line);
    }
};

const parseNumber = (line:string[]):number => {
    let c;
    let num = parseInt(c = line.shift());
    if (isNaN(num))
        throw `Numeric char expected, yet encountered '${c}'`;
    while (/\d/.test(line[0])) {
        num = num * 10 + parseInt(line.shift());
    }
    return num;
};


const parseVerbinding = (line, avp: AVP) => {
    const headLength = parseNumber(line);
    if (/G/.test(line[0])) {
        parseGV(line, avp.rail, headLength);
        return;
    }
    //const verbinding = new Verbinding(avp);
    parseKabel(line, avp.rail, headLength);
};

const parseAVP = (line) => {
    let c;
    const avp = new AVP();
    try {
        while (c = line.shift()) {
            switch (c) {
                case "(":
                    parseVerbinding(line, avp);
                    break;
                default:
                    throw `parseAVP encountered unexpected char '${c}'`;
            }
        }
    } catch (error) {
        console.warn(`Parse error: ${error}\nProgram execution stopped.`);
        process.exit();
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

// const configs = [
//     "(10F{40;10;3;50}1)(10V10W10H10T10A10K{L;4}1)(10G{160;1})(10G{250;2})",
//     "(10V)",
//     "(10(1V10V10V10V10V1)(1V10V10V10V10V1)(1V10V10V10V10V1))(10(1V10V10V10V10V1)(1V10V10V10V10V1)(1V10V10V10V10V1))(10(1V10V10V10V10V1)(1V10V10V10V10V1)(1V10V10V10V10V1))(10(1V10V10V10V10V1)(1V10V10V10V10V1)(1V10V10V10V10V1))",
//     "(10(1W10W10W10W10W1)(1W10W10W10W10W1)(1W10W10W10W10W1))(10(1W10W10W10W10W1)(1W10W10W10W10W1)(1W10W10W10W10W1))(10(1W10W10W10W10W1)(1W10W10W10W10W1)(1W10W10W10W10W1))(10(1W10W10W10W10W1)(1W10W10W10W10W1)(1W10W10W10W10W1))",
//     "(10(1H10H10H10H10H1)(1H10H10H10H10H1)(1H10H10H10H10H1))(10(1H10H10H10H10H1)(1H10H10H10H10H1)(1H10H10H10H10H1))(10(1H10H10H10H10H1)(1H10H10H10H10H1)(1H10H10H10H10H1))(10(1H10H10H10H10H1)(1H10H10H10H10H1)(1H10H10H10H10H1))",
//     "(10(1T10T10T10T10T1)(1T10T10T10T10T1)(1T10T10T10T10T1))(10(1T10T10T10T10T1)(1T10T10T10T10T1)(1T10T10T10T10T1))(10(1T10T10T10T10T1)(1T10T10T10T10T1)(1T10T10T10T10T1))(10(1T10T10T10T10T1)(1T10T10T10T10T1)(1T10T10T10T10T1))",
//     "(50F{15;5;15}50F{15;5;15}1)(50F{15;5;15}50F{15;5;15}1)(50F{15;5;15}50F{15;5;15}1)(50F{15;5;15}50F{15;5;15}1)",
// ]

const numLookup = {
    "A": 50,
    "T": 30,
    "H": 30,
    "W": 22,
    "V": 15,
};

const OFFSET =  30;

const configs:{[name:string]:string} = {};
for (var woningType of ["V", "W", "H", "T", "A"]) {
    const noOfAansl = numLookup[woningType];
    for (var cableLen of [200, 250, 300, 350, 400]) {
        const config = Array(noOfAansl).fill(woningType).join(String(Math.round((cableLen - OFFSET) / noOfAansl)));
        configs[`${noOfAansl}x${woningType}_over_${cableLen}m`]= `(${OFFSET}${config}1)`;
    }
}

let typeCache;

Object.entries(configs).forEach(async ([name, config]) => {

    const avp = parseAVP(config.split(''));

    typeCache = await cacheTypes();

    const file = new GaiaFile();
    ["NETWERK", "MSR", "APPARTEMENTEN"].forEach(shName => {
        const sheet = file.addSheet(shName);
        avp.computePresentation(sheet);
    });

    const fileContents = file.toString();
    await writeToFile(fileContents, `./data/gnf/${name}.gnf`);
});

