async function fetchAllSVGsFromFolder(folderPath) {
    const response = await fetch(folderPath);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const svgElements = doc.querySelectorAll('a[href$=".svgFolder"]'); // Select all <a> elements with .svgFolder extension

    const svgFiles = Array.from(svgElements).map(async (svgElement) => {
        const svgPath = `${folderPath}/${svgElement.getAttribute('href')}`;
        const svgResponse = await fetch(svgPath);
        const svgText = await svgResponse.text();
        return svgText;
    });

    return Promise.all(svgFiles);
}
const svgArray = []
async function generateSVGMapFromFolder(folderPath) {
    const svgFiles = await fetchAllSVGsFromFolder(folderPath);


    svgFiles.forEach(svgText => {
        const svgElement = parseSVG(svgText);
        const svgFileName = svgElement.getAttribute('xmlns');// Replace with your SVG file attribute name
        const svgId = svgElement.getAttribute('id');
        //third
        const scriptInfinite = doc.querySelector('script')
        const scriptCode = scriptInfinite.textContent;
        // console.log(scriptCode)
        // Extract the isInfinite function from the script to check if the animation is infinite or not
        const functionName = 'isInfinite';
        const functionRegex = new RegExp(`${functionName}\\s*:\\s*function\\s*\\(\\s*t\\s*,\\s*e\\s*\\)\\s*{\\s*return\\s*0===e\\.iterations\\s*}`);
        const functionMatch = scriptCode.match(functionRegex);
        //check if it's infinite play
        let infinite
        if (functionMatch) {
            infinite = "animated Infinite"
            console.log('its infinite and a animation')
        }
        else{
            infinite = "not infinite"
            console.log("either not animated or not infinite")
        }
        svgArray.push({name: svgFileName, id: svgId, animated: infinite})
    });



}

async function main() {
    await generateSVGMapFromFolder('./svgFolder');

    console.log(svgArray);

    const csvData = svgArray.map(row => Object.values(row).join(',')).join('\n');

    // Create a Blob object with the CSV data
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a download link and simulate a click to download the file
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'data.csv';
    downloadLink.click();
}

main();
