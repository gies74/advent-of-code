const fs = require('fs');

const PIXEL_SCALING = 40;

//#region Classes

class Geometry {

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
}

class LineString extends Geometry {
    points:Point[];
    constructor(points) {
        super();
        this.points = points;
    }
    toString() {
        return this.points[0].toString() + "  ## " + this.points.slice(1).reverse().map(pt => pt.toString()).join("  ");
    }
}


class GaiaSheet {
    name:string;
    no: number;
    sheetObjects:SheetObject[] = [];
    constructor(name) {
        this.name = name;
        this.no = GaiaObject.newId("SHEET");
    }

    registerObject(gaiaObj:GaiaObject, geometry:Geometry) {
        new SheetObject(gaiaObj, this, geometry);
    }
}

class GaiaFile {
    sheets:{[name:string]:GaiaSheet} = {};

    constructor() {        
        GaiaObject.resetIdSequences();
    }

    addSheet(name:string) {
        this.sheets[name] = new GaiaSheet(name);
        return this.sheets[name];
    }

    toString() {
        let contents = "G7.15\nNETWORK\n\n[OPTIONS]\nCurrency=€\n[]\n\n";

        const sheetLines = Object.keys(this.sheets).map((shName,idx) => "#1 " + String(idx + 1) + " '" + shName + "' $00C0C0C0 0 0 0 0 0 0 0 0 0 0").join("\n");
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
                    .replace("@HOMETAGLINES", ko.homeTagLines);
                contents += tagLines;
                const sheetTagLine = ko.sheetTagLine;
                ko.sheetObjects.forEach(so => {
                    const sheetNo = so.gaiaSheet.no;
                    const geomString = so.geometry.toString();
                    contents += sheetTagLine
                        .replace("@SHEETNO", String(sheetNo))
                        .replace("@GEOMSTRING", geomString)
                        .replace("@NODESHAPE", ko.nodeshape);
                });
            });

            contents += `[]\n\n`;
        });
        return contents;

    }
}

class SheetObject {
    gaiaObject:GaiaObject;
    gaiaSheet: GaiaSheet;
    geometry: Geometry;
    constructor(go:GaiaObject, gs:GaiaSheet, geom:Geometry) {
        this.gaiaObject = go;
        this.gaiaSheet = gs;
        this.geometry = geom;

        go.sheetObjects.push(this);
        gs.sheetObjects.push(this);
    }
    // node    "tag9": { "bladnr": "1", "x": "0", "y": "0", "symbool": "11",                                   "kleur": "$000000FF", "grootte": "1", "dikte": "4", "stijl": "0", "tekstkleur": "$00000000", "tekstgrootte": "30", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0", "schuinetekst": "0", "usx": "8", "usy": "-8",                                                                                   "stsx": "-20", "stsy": "20",                           "nx": "05", "ny": "05"
    // source  "tag9": { "bladnr": "2", "x": "0", "y": "0",                                                    "kleur": "$000000FF", "grootte": "1", "dikte": "4", "stijl": "0", "tekstkleur": "$00000000", "tekstgrootte": "08", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0",                                               "fsx": "007", "fsy": "-12",                                                                                     "sx": "00", "sy": "-85", "nx": "05", "ny": "05", "vo": "0"
    // home    "tag9": { "bladnr": "3", "x": "0", "y": "0",                                                    "kleur": "$000000FF", "grootte": "5", "dikte": "1", "stijl": "0", "tekstkleur": "$00000000", "tekstgrootte": "30", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0",                                               "fsx": "006", "fsy": "-11",                                                                                     "sx": "49", "sy": "-98", "nx": "-5", "ny": "05", "vo": "0"
    // load    "tag9": { "bladnr": "4", "x": "0", "y": "0",                                                    "kleur": "$00000000", "grootte": "1", "dikte": "1", "stijl": "0", "tekstkleur": "$00008000", "tekstgrootte": "08", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0",                                               "fsx": "012", "fsy": "006",                                                                                     "sx": "00", "sy": "000", "nx": "-5", "ny": "-5", "vo": "0"
    // trafo   "tag9": { "bladnr": "2",                                                                        "kleur": "$000000FF", "grootte": "1", "dikte": "1", "stijl": "0", "tekstkleur": "$00000000", "tekstgrootte": "08", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0",                                               "fsx": "012", "fsy": "06", "ssx": "-15", "ssy": "006", "msx": "00", "msy": "-24", "stsx": "-20", "stsy": "20",                           "nx": "05", "ny": "00",           "vo1": "0", "vo2": "0", "#": "#", "coordinates": ""
    // link    "tag9": { "bladnr": "2",                                                                        "kleur": "$000000FF", "grootte": "1", "dikte": "1", "stijl": "0", "tekstkleur": "$00000000", "tekstgrootte": "08", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0",                                               "fsx": "-15", "fsy": "06", "ssx": "-15", "ssy": "006", "msx": "04", "msy": "000", "stsx": "-20", "stsy": "20",                           "nx": "00", "ny": "05",           "vo1": "0", "vo2": "0", "#": "#", "coordinates": " 500 0 550 0 ## 550 150 500 150"
    // cable   "tag9": { "bladnr": "1",                                                                        "kleur": "$000000FF", "grootte": "5", "dikte": "1", "stijl": "0", "tekstkleur": "$00000000", "tekstgrootte": "30", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0",                                               "fsx": "007", "fsy": "12", "ssx": "-07", "ssy": "-12", "msx": "24", "msy": "000", "stsx": "-20", "stsy": "20",                           "nx": "05", "ny": "00",           "vo1": "0", "vo2": "0", "#": "#", "coordinates": ""
    // fuse    "tag9": { "bladnr": "2",                                      "afstand": "0", "overzijde": "0", "kleur": "$000000FF", "grootte": "1", "dikte": "1", "stijl": "0", "tekstkleur": "$00000000", "tekstgrootte": "08", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0",                                                                                                                                                              "sx": "12", "sy": "-10",  "nx": "00", "ny": "00"


}


class GaiaObject {
    sheetObjects:SheetObject[] = [];
    id:number;
    static objectKind = "OBJECT";
    static idSequence:{[name:string]:number} = {};
    static lookups = {
        "objectKind": "OBJECT",
        "tagLines": "#"
    }

    getNetwerkGeometry():Geometry {
        return this.sheetObjects.find(so => so.gaiaSheet.name === "NETWERK").geometry as Geometry;
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

    get nodeshape() {
        return "11 $000000FF 1";
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

    get _staticLookup() {
        return (<typeof GaiaObject | typeof GaiaNode | typeof Cable | typeof Transformer | typeof HomeNode >this.constructor).lookups;
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
    static objectKind = "NODE";
    // node    "tag9": { "bladnr": "1", "x": "0", "y": "0", "symbool": "11",                                   "kleur": "$000000FF", "grootte": "1", "dikte": "4", "stijl": "0", "tekstkleur": "$00000000", "tekstgrootte": "30", "lettertype": "'Arial'", "tekststijl": "0", "geentekst": "0", "opdekop": "0", "schuinetekst": "0", "usx": "8", "usy": "-8",                                                                                   "stsx": "-20", "stsy": "20",                           "nx": "05", "ny": "05"
    static lookups = {
        "objectKind": "NODE",
        "tagLines": 
            "#1 @ID 45297,5251 '@SHORTNAME' '' '' @KVOLTAGE 1 '' 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING @NODESHAPE 4 0 $00000000 10 'Arial' 0 0 0 0 15 -15 -20 20 5 5\n"
    }

    edges:GaiaEdge[] = [];
    pointGeometry:Point;    
    x:number;
    y:number;
    nodeObject:GaiaObject = null;
    constructor() {
        super();
    }

    computeLocNetwerk(netwerkSheet:GaiaSheet, x:number, y:number, fromEdge:GaiaEdge) {

        const myGeometry = new Point(x, y);
        if (fromEdge) {
            const linePoints = [];
            const feederNode = fromEdge.getOpposNode(this);
            const feederGeometry = feederNode.getNetwerkGeometry() as Point;
            if (!(feederNode instanceof RailNode)) {
                linePoints.push(new Point(feederGeometry.x, feederGeometry.y));
            }
            linePoints.push(new Point(feederGeometry.x, myGeometry.y));
            linePoints.push(new Point(myGeometry.x, myGeometry.y));

            const edgeGeometry = new LineString(linePoints);
            netwerkSheet.registerObject(fromEdge, edgeGeometry);
            fromEdge.fuses.forEach(fuse => {
                netwerkSheet.registerObject(fuse, new Point(0,0));
            });
        }
        netwerkSheet.registerObject(this, myGeometry);
        if ([HomeNode, LoadNode, SourceNode].find(t => this instanceof t)) {
            const nodeObjGeom = new Point(x + 25, y - 25);
            netwerkSheet.registerObject((this as GaiaNode).nodeObject, nodeObjGeom);
        }

        const oppSegs = this.getOpposCables(fromEdge);
        if (oppSegs.length === 0) {
            return 1;
        }

        let dy = 0;
        oppSegs.forEach(s => {
            const length = s instanceof Cable ? (s as Cable).length : 10;
            dy += s.getOpposNode(this).computeLocNetwerk(netwerkSheet, x + PIXEL_SCALING * length, y + PIXEL_SCALING * 4 * dy, s);
        }, this);

        return dy;
    }

    getOpposCables(cab:GaiaEdge = null) {
        return this.edges.filter(s => s !== cab);
    }
    
}

class RailNode extends GaiaNode {
    size:number = 1;

    get nodeshape() {
        return `1 $000000FF ${this.size}`;
    }

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
    constructor() {
        super();
        this.nodeObject = new Load(this);
    }
}

class HomeNode extends GaiaNode {
    constructor(homeKind) {
        super();
        this.nodeObject = new Home(this, homeKind);
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
    n1:GaiaNode;
    n2:GaiaNode;
    fuses:Fuse[] = [];

    constructor(n1:GaiaNode) {
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

    getOpposNode(n:GaiaNode) {
        return n === this.n1 ? this.n2 : this.n1;
    }
    
}

class Transformer extends GaiaEdge {
    static objectKind = "TRANSFORMER";
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
    static objectKind = "LINK";
    static lookups = {
        "objectKind": "LINK",
        "tagLines": 
            "#1 @ID 45297,5251 'MV' '' '' 10,5 1 '' 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
            "#9 @SHEETNO @GEOMSTRING 1 $000000FF 10 4 0 $00000000 10 'Arial' 0 0 0 0 0 -110 -20 20 5 5\n",
        "sheetTagLine":
                "#9 @SHEETNO $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 6  -15 6  0 24  -20 20  0 5  0 0 # @GEOMSTRING\n"
    }

}

class Cable extends GaiaEdge {
    static objectKind = "CABLE";
    static lookups = {
        "objectKind": "CABLE",
        "tagLines": 
            "#1 @ID 45297,528 @NODEID1 @NODEID2 '' 1 1 1 1 1 1 1 1 1 1 '' '' 0,025 0 0 0 1000 0 1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9 1 1 1 1 1 1 1 1 '' '' '' '' \n" +
            "#2 @LENGTH '4*150 VVMvKhsas50/Alk 4*6' \n" +
            "#3 '150 Al; 6' 0,75 0 0,72 0,43 225 0,5 290 0,75 260 1 240 8,5 20 55 160 50 0,25692 0,79626 0,0517 0,72746 0,0496 0,70572 0,39761 0,69944 0,05103 0,70029 2,9485 0,89397 0,05386 0,7488 0,04866 0,698 0,04937 0,70422 0,04678 0,68292 0,05103 0,70026 200 6 52 1,05 1 \n",
        "sheetTagLine":
            "#9 @SHEETNO $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 6  -15 6  0 4  -20 20  5 0  0 0 # @GEOMSTRING\n"
    }
    length:number = 0;

    get cableLength() {
        return this.length;
    }

}

class Fuse extends GaiaObject {
    static objectKind = "FUSE";
    static lookups = {
        "objectKind": "FUSE",
        "tagLines": 
            "#1 @ID 45297,5264 ''       @EDGESIDE 1 '@FUSETYPELONG' \n",
        "sheetTagLine":
            "#9 @SHEETNO 0 0 $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 -6  0 0\n"
    }
    edge:GaiaEdge;
    node:GaiaNode;
    _kVoltage:string;
    _fuseTypeLong:string;
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
        const prefix = this.edge instanceof Transformer ? "T" : this.edge instanceof Cable ? "K" : "L";
        const side = this.edge.n1 === this.node ? 1 : 2;
        return `${prefix}${this.edge.id} ${side}`;
    }

    get fuseTypeLong() {
        return this._fuseTypeLong;
    }
}

class Frame extends GaiaObject {
    static objectKind = "FRAME";
    static lookups = {
        "objectKind": "FRAME",
        "tagLines": 
            "#1 @ID 45297,5251 'MV' '' '' 10,5 1 '' 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 6  -15 6  0 24  -20 20  0 5  0 0 # @GEOMSTRING\n"
    }
    
}

class GaiaNodeObject extends GaiaObject {
    node:GaiaNode;
    constructor(node) {
        super();
        this.node = node;
    }

    get nodeid() {
        return this.node.id;
    }
}

class Home extends GaiaNodeObject {
    static objectKind = "HOME";
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
        },                            
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING $000000FF 1 1 0 $00000000 10 'Arial' 0 0 0 7 -12  0 25  5 5  0\n",
    };
    homeKind:string;
    constructor(node, homeKind) {
        super(node);
        this.homeKind = homeKind;
    }
    get homeTagLines() {
        return this._staticLookup["homeTagLines"][this.homeKind];
    }    


}

class Load extends GaiaNodeObject {
    static objectKind = "LOAD";
    static lookups = {
        "objectKind": "LOAD",
        "tagLines": 
            "#1 @ID 45297,5251 'MV' '' '' 10,5 1 '' 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO $000000FF 1 1 0  $00000000 10 'Arial' 0 0 0 12 6  -15 6  0 24  -20 20  0 5  0 0 # @GEOMSTRING\n"
    }

}

class Source extends GaiaNodeObject {
    static objectKind = "SOURCE";
    static lookups = {
        "objectKind": "SOURCE",
        "tagLines": 
            "#1 @NODEID @ID 45297,5266 '' 1 1 1 0 '' 10,025 10,975 10,5 75 0 0\n",
        "sheetTagLine":
            "#9 @SHEETNO @GEOMSTRING $000000FF 1 1 0 $00000000 10 'Arial' 0 0 0 -15 6  -125 0  5 5  0\n"
    }
}


class Kabel {
    verbinding:Verbinding;
    start:GaiaNode;        
    constructor(start:GaiaNode, verbinding:Verbinding) {
        this.verbinding = verbinding;
        verbinding.kabels.push(this);
        this.start = start;
    }
}


class Verbinding {
    avp:AVP;
    kabels = [];
    moffen = [];
    constructor(avp:AVP) {
        this.avp = avp;
        avp.verbindingen.push(this);

    }
}

class AVP {
    verbindingen = [];
    trafo:Transformer;
    constructor() {
        const ms = new SourceNode();
        const rail = new RailNode();
        this.trafo = new Transformer(ms);
        this.trafo.n2 = rail;
        rail.edges.push(this.trafo);

        new Fuse(this.trafo, ms, "10", "PATR Trafo 630 kVA H");
        new Fuse(this.trafo, rail, "0,4", "PATR Trafo 630 kVA L");
    }

    computeNetwerkPresentation(netwerkSheet:GaiaSheet) {
        const depth = this.ms.computeLocNetwerk(netwerkSheet, 0, 0, null);
        const railGeom = this.rail.getNetwerkGeometry() as Point;
        railGeom.y = (depth - 1) * 2 * PIXEL_SCALING;  // 160
        this.rail.size = 2 + (depth - 1) * 8;  // 2 + 2 * 10 = 18

        const sourceNodeGeom = this.ms.getNetwerkGeometry() as Point;
        sourceNodeGeom.y = railGeom.y;
        const sourceGeom = this.ms.nodeObject.getNetwerkGeometry() as Point;
        sourceGeom.x = sourceNodeGeom.x - 20;
        sourceGeom.y = sourceNodeGeom.y;


        (this.trafo.getNetwerkGeometry() as LineString).points = [sourceNodeGeom, railGeom];
    }

    get rail() {
        return this.trafo.n2 as RailNode;
    }

    get ms() {
        return this.trafo.n1 as SourceNode;
    }

}

class GaiaLocation {
    x:number = 0;
    y:number = 0;
}
//#endregion

//#region Parsers
const parseKabel = (line:string[], node:GaiaNode, verbinding:Verbinding) => {        
    let c;
    const kabel = new Kabel(node, verbinding);
    let segment = new Cable(node);
    let m = new AMof();
    while (c = line.shift()) {
        if (/\d/.test(c)) {
            segment.length = 10 * segment.length + parseInt(c);
        } else if (/[THVW]/.test(c)) {
            const h = new HomeNode(c);
            segment.n2 = h;
            h.edges.push(segment);
            segment = new Cable(h);
        } else if (c === "(") {
            if (!segment.n2) {              
                segment.n2 = m;
                m.edges.push(segment);
            }
            parseKabel(line, m, verbinding);
        } else if (c === ")") {
            if (m.edges.length >= 2)
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

const parseVerbinding = (line, avp:AVP) => {
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
          console.info('[INFO] Example 1 succesfully extracted');
          attemptComplete(null);
        });
      } catch {
        console.warn('[WARN] Dit not extract example');
        attemptComplete(null);
      }
    });
  };




const configs = [
    "(200V1)(200W1)(200H1)(200T1)"
    , "(50(50(50(45(5V5V5V5V5V1)(5V5V5V5V5V1)(5V5V5V5V5V1)))))(50(50(50(45(5W5W5W5W5W1)(5W5W5W5W5W1)(5W5W5W5W5W1)))))(50(50(50(45(5H5H5H5H5H1)(5H5H5H5H5H1)(5H5H5H5H5H1)))))(50(50(50(45(5T5T5T5T5T1)(5T5T5T5T5T1)(5T5T5T5T5T1)))))"
    //, "(5V1)(5W1)(5H1)(5T1)"
    // , "(5(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1))(5(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1)(5V1))"
    // , "(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)(5H5T5T5T5H20H5T5T5T5T5T5H20H5T5T5T5H1)"
]
configs.forEach(async config => {

    const file = new GaiaFile();
    const netwerkSheet = file.addSheet("NETWERK");
    const avp = parseAVP(config.split(''));
    avp.computeNetwerkPresentation(netwerkSheet);

    const fileContents = file.toString();
    await writeToFile(fileContents, `./data/${config}.gnf`);
});
const x = 2;




