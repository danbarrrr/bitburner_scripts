loop forever {
    if security is not minimum {
        await ns.weaken(target)
    } else if money is not maximum {
        await ns.grow(target)
    } else {
        await ns.hack(target)
    }
}

await ns.hack(target) // or grow, or weaken