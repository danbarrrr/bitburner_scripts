/** @param {NS} ns */
export async function main(ns) {
    // ns.args[0] reads the first word you type after the script name
    const target = ns.args[0];

    // Safety check: If you forget to provide a target, kill the script gracefully
    if (!target) {
        ns.tprint("ERROR: You must provide a target server argument! Example: run basic_hack.js n00dles");
        return;
    }

    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
        await ns.sleep(100);
    }
}
