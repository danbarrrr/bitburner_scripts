/** @param {NS} ns */
export async function main(ns) {
    // 1. Scan the immediate network for connected servers
    const servers = ns.scan();
    const hackScript = "basic_hack.js";

    for (const server of servers) {
        // Skip your own home computer
        if (server === "home") continue;

        // Check if we need to open ports (0 ports required means we can just NUKE)
        if (ns.getServerNumPortsRequired(server) === 0) {
            
            // Gain root access if we don't have it already
            if (!ns.hasRootAccess(server)) {
                ns.nuke(server);
                ns.tprint(`[SUCCESS] Nuke deployed on ${server}`);
            }

            // Copy our basic_hack.js script from home to the target server
            await ns.scp(hackScript, server, "home");

            // Calculate RAM allocation
            const serverMaxRam = ns.getServerMaxRam(server);
            const scriptRamCost = ns.getScriptRam(hackScript);

            if (serverMaxRam > 0) {
                // Determine the maximum number of threads that can fit in the RAM
                const threads = Math.floor(serverMaxRam / scriptRamCost);

                // If it has enough RAM and the script isn't already running, execute it
                if (threads > 0 && !ns.isRunning(hackScript, server, server)) {
                    // Syntax: ns.exec(script, host, threads, argument)
                    ns.exec(hackScript, server, threads, server);
                    ns.tprint(`[RUNNING] Started ${hackScript} on ${server} with ${threads} threads targeting itself.`);
                }
            }
        }
    }
}
