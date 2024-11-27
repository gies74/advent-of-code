const readXlsxFile = require('read-excel-file/node');

'use strict';

const _FILE = './src/Types.xlsx';

const _FUSE_SCHEMA = {
    'Shortname': {
        prop: 'shortname',
        type: String
    },
    'Unom': {
        prop: 'unom',
        type: Number
    },
    'Inom': {
        prop: 'inom',
        type: Number
    }
};
(() => {
    Array(16).fill(0).forEach((_, idx) => {
        _FUSE_SCHEMA[`I${idx + 1}`] = {
            prop: `i${idx + 1}`,
            type: Number,
        };
        _FUSE_SCHEMA[`T${idx + 1}`] = {
            prop: `t${idx + 1}`,
            type: Number,
        };
    });
})();

const _CABLE_SCHEMA = {
    "Shortname": {
        prop: 'Shortname',
        type: String
    }
};
(() => {
    const cols = ["Unom", "Price", "C", "C0", "Inom0", "G1", "Inom1", "G2", "Inom2", "G3", "Inom3", "Ik1s", "TR", "TInom", "TIk1s", "Frequency", "R_C", "X_C", "R_CC_N", "X_CC_N", "R_CC_T", "X_CC_T", "R_E", "X_E", "R_CE", "X_CE", "R_H", "X_H", "R_CH_N", "X_CH_N", "R_CH_T", "X_CH_T", "R_HH_N", "X_HH_N", "R_HH_T", "X_HH_T", "R_HE", "X_HE", "Inom_E", "Ik1s_E", "Inom_H", "Ik1s_H", "R_C/R_N"];
    cols.forEach(col => {
        _CABLE_SCHEMA[col] = {
            prop: col.replace("/", "-"),
            type: Number
        };
    });
})();

module.exports = {
    
    cacheTypes: async () => {
        const typeCache = {};

        // fuses
        await readXlsxFile( _FILE, { schema: _FUSE_SCHEMA, sheet: 'Fuse' } ).then((result) => {

            typeCache["fuses"] = {};
            [16, 25, 32, 40, 50, 63, 80].forEach(i => {
                const fuse =  result.rows.find(row => row["shortname"] === `Caut ${i} A`);
                const items = Object.values(fuse);
                typeCache["fuses"][i] = `#3 '${items[0]}' ${items.slice(1).join(' ').replace(/\./g, ",")}`;
            });


        });

        // cables
        await readXlsxFile( _FILE, { schema: _CABLE_SCHEMA, sheet: 'Cable' } ).then((result) => {

            typeCache["cables"] = {};
            ["16Cu+16", "6Cu+6", "150 Al; 6"].forEach(shortname => {
                const cable = result.rows.find(row => row["Shortname"] === shortname);
                const items = Object.values(cable);
                typeCache["cables"][shortname] = `#2 '${shortname}' ${items.slice(1).join(' ').replace(/\./g, ",")}`;
            });


        });


        return typeCache;
    }
}