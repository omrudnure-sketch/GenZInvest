
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';

const execPromise = util.promisify(exec);

export async function GET() {
    try {
        // Resolve path to the python script
        const scriptPath = path.resolve(process.cwd(), 'lib/scripts/fetch_market.py');

        // Execute Python Script
        // NOTE: Assumes 'python' is in PATH. On some systems might need 'python3'
        const { stdout, stderr } = await execPromise(`python "${scriptPath}"`, { timeout: 15000 });

        if (stderr) {
            console.warn("Python Script Warning:", stderr);
        }

        const data = JSON.parse(stdout.trim());

        return NextResponse.json(data);

    } catch (error) {
        console.error("Market Data Fetch Error:", error);

        // Fallback data if Python fails completely
        return NextResponse.json({
            status: "error",
            indices: [
                { name: "NIFTY 50", value: 24000.00, change: "0.00% (Offline)" },
                { name: "BANK NIFTY", value: 48500.00, change: "0.00% (Offline)" },
                { name: "NIFTY IT", value: 33000.00, change: "0.00% (Offline)" }
            ]
        });
    }
}
