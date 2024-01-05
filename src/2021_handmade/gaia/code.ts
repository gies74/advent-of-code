

//#region Classes

    class GaiaNode {
        segments:Segment[] = [];
        constructor() {
        }
    }

    class RailNode extends GaiaNode {

    }

    class HomeNode extends GaiaNode {
        kind:string;
        constructor(kind) {
            super();
            this.kind = kind;
        }
    }

    class EMof extends GaiaNode {

    }
    class AMof extends GaiaNode {

    }

    class Segment {
        length:number = 0;
        n1:GaiaNode;
        n2:GaiaNode;
        constructor(n1:GaiaNode) {
            this.n1 = n1;
            n1.segments.push(this);
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
        rail:GaiaNode;
        constructor() {
            this.rail = new RailNode();
        }
    }
//#endregion

//#region Parsers
    const parseKabel = (line:string[], node:GaiaNode, verbinding:Verbinding) => {        
        let c;
        const kabel = new Kabel(node, verbinding);
        let segment = new Segment(node);
        let m = new AMof();
        while (c = line.shift()) {
            if (/\d/.test(c)) {
                segment.length = 10 * segment.length + parseInt(c);
            } else if (/[THVW]/.test(c)) {
                const h = new HomeNode(c);
                segment.n2 = h;
                h.segments.push(segment);
                segment = new Segment(h);
            } else if (c === "(") {
                if (!segment.n2) {              
                    segment.n2 = m;
                    m.segments.push(segment);
                }
                parseKabel(line, m, verbinding);
            } else if (c === ")") {
                if (m.segments.length === 3)
                    return;
                m = new EMof();
                segment.n2 = m;
                m.segments.push(segment);
                return;
            } else {
                throw "Error kabel";
            }
        }
    };

    const parseVerbinding = (line, avp:AVP) => {
        let c;
        const verbinding = new Verbinding(avp);
        parseKabel(line, verbinding.avp.rail, verbinding);
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

    const avp = parseAVP("(5)(5V5(4V1)(10W8W1))".split(''));
    const iia = 2;
