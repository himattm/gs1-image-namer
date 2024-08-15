// Object containing different naming schemes
const schemes = {
    // GS1 Angles-EACH
    scheme1: [
        { token: "A1C1", name: "Front Angle" },
        { token: "A1L1", name: "Left Front Angle" },
        { token: "A1R1", name: "Right Front Angle" },
        { token: "A1N1", name: "Front" },
        { token: "A7N1", name: "Back" },
        { token: "A2N1", name: "Left" },
        { token: "A8N1", name: "Right" },
        { token: "A3N1", name: "Top" },
        { token: "A8N1", name: "Bottom" },
        { token: "A1CC", name: "Open Lid" },
        { token: "L2", name: "Nutrition Facts Label" },
        { token: "L4", name: "Ingredients Label" },
        { token: "L3", name: "Scannable Barcode" },
    ],
    // GS1 Angles-CASE
    scheme2: [
        { token: "A1CA", name: "Closed Tray Front Angle" },
        { token: "A1LA", name: "Closed Tray Left Front Angle" },
        { token: "A1RA", name: "Closed Tray Right Front Angle" },
        { token: "A1NA", name: "Closed Tray Front" },
        { token: "A7NA", name: "Closed Tray Back" },
        { token: "A2NA", name: "Closed Tray Left" },
        { token: "A8NA", name: "Closed Tray Right" },
        { token: "A3NA", name: "Closed Tray Tip" },
        { token: "A9NA", name: "Closed Tray Bottom" },
        { token: "A1CM", name: "Open Tray Front Angle" },
        { token: "A1LM", name: "Open Tray Left Front Angle" },
        { token: "A1RM", name: "Open Tray Right Front Angle" },
        { token: "L2", name: "Nutrition Facts Label" },
        { token: "L4", name: "Ingredients Label" },
        { token: "L3", name: "Scannable Barcode" },
    ]
    // Additional schemes can be added here
};


const schemeNames = {
    scheme1: "GS1 Angles-EACH",
    scheme2: "GS1 Angles-CASE"
};