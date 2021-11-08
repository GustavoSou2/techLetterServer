module.exports = async function getDataOnHTML(pathHTML) {
    const data = [];
    await document.querySelectorAll(pathHTML).forEach((data) => {
        data.push(data.innerText);
    })
    return data;
}