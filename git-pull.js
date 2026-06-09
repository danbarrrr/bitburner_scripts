/** @param {NS} ns */
export async function main(ns) {
    // 1. Configure your repository details
    const user = "danbarrrr";
    const repo = "bitburner_scripts";
    const branch = "main"; 

    // GitHub API URL to list files in the root repository directory
    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents?ref=${branch}`;
    // Base URL for pulling raw text file data
    const rawBaseUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}`;

    ns.tprint("📡 Requesting repository manifest from GitHub...");

    // We use ns.wget to fetch the JSON file list from the GitHub API and temporarily save it
    const manifestFile = "repo_manifest.txt";
    const status = await ns.wget(apiUrl, manifestFile);

    if (!status) {
        ns.tprint("❌ ERROR: Failed to reach GitHub API. Check your username, repo name, or internet connection.");
        return;
    }

    // Read the downloaded JSON data and parse it into a JavaScript object
    const manifestData = ns.read(manifestFile);
    let files;
    try {
        files = JSON.parse(manifestData);
    } catch (e) {
        ns.tprint("❌ ERROR: Failed to parse GitHub response. Is the repository private?");
        ns.rm(manifestFile); // Clean up
        return;
    }

    let downloadCount = 0;

    // Loop through every item found in the repository
    for (const item of files) {
        // Only download if it's a file, and its name ends with '.js' or '.txt'
        if (item.type === "file" && (item.name.endsWith(".js") || item.name.endsWith(".txt"))) {
            ns.tprint(`Fetching: ${item.name}`);
            
            const fileUrl = `${rawBaseUrl}/${item.name}`;
            const success = await ns.wget(fileUrl, item.name);
            
            if (success) {
                downloadCount++;
            } else {
                ns.tprint(`⚠️ Failed to download: ${item.name}`);
            }
        }
    }

    // Clean up the temporary manifest file
    ns.rm(manifestFile);

    ns.tprint(`🏁 Git sync complete! Successfully downloaded ${downloadCount} files.`);
}
