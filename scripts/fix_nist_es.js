const mongoose = require('mongoose');
const Framework = require('../models/Framework');
const FrameworkRequirement = require('../models/FrameworkRequirement');
require('dotenv').config();

async function fixNist() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const nist = await Framework.findOne({ name: /NIST/i });
        if (!nist) {
            console.log("NIST framework not found");
            process.exit(0);
        }

        // Add typical NIST requirements if missing
        const reqs = [
            { code: "AC-1", domain: "Access Control", requirement: "Access Control Policy", guidance: "Develop, document, and disseminate an access control policy." },
            { code: "AC-2", domain: "Access Control", requirement: "Account Management", guidance: "Manage information system accounts." }
        ];

        for (const r of reqs) {
            await FrameworkRequirement.findOneAndUpdate(
                { framework_id: nist._id, code: r.code },
                { ...r, framework_id: nist._id },
                { upsert: true }
            );
        }

        console.log("NIST framework requirements updated.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixNist();
