import { join } from "path";
import { readdir, readFile, writeFileSync } from "fs"
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const dirPath = join(__dirname, "../portfolioEntries");
const dirPathServices = join(__dirname, "../services");
const dirPathHome = join(__dirname, "../home");

let portfolioEntriesList = [];
let servicesEntriesList =[];
let homeEntriesList = [];


const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
}

const formatDate = (date) => {
    const datetimeArray = date.split("T")
    const dateArray = datetimeArray[0].split("-")
    const timeArray = datetimeArray[1].split(":")
    const month = dateArray[1]
    const monthName = months[dateArray[1]]
    const day = dateArray[2]
    const year = dateArray[0]
    const time = `${timeArray[0]}:${timeArray[1]}`

    return { "month": month, "monthName": monthName, "day": day, "year": year, "time": time }
}



const getPortfolioEntries = () => {
    readdir(dirPath, (err, files) => {
        if (err) {
            return console.log("Failed to list contents of directory: " + err)
        }
        let ilist = []
        files.forEach((file, i) => {
            let obj = {}
            let post
            readFile(`${dirPath}/${file}`, "utf8", (err, contents) => {
                const getMetadataIndices = (acc, elem, i) => {
                    if (/^---/.test(elem)) {
                        acc.push(i)
                    }
                    return acc
                }
                const parseMetadata = ({ lines, metadataIndices }) => {
                    if (metadataIndices.length > 0) {
                        let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1])
                        metadata.forEach(line => {
                            obj[line.split(": ")[0]] = line.split(": ")[1]
                        })
                        return obj
                    }
                }
                const parseContent = ({ lines, metadataIndices }) => {
                    if (metadataIndices.length > 0) {
                        lines = lines.slice(metadataIndices[1] + 1, lines.length)
                    }
                    return lines.join("\n")
                }
                const lines = contents.split("\n")
                const metadataIndices = lines.reduce(getMetadataIndices, [])
                const metadata = parseMetadata({ lines, metadataIndices })
                const description = parseContent({lines, metadataIndices})
                const parsedDate = metadata.date ? formatDate(metadata.date) : new Date()
                const publishedDate = `${parsedDate["monthName"]} ${parsedDate["day"]}, ${parsedDate["year"]}`
                const datestring = `${parsedDate["year"]}-${parsedDate["month"]}-${parsedDate["day"]}T${parsedDate["time"]}:00`
                const date = new Date(datestring)
                const timestamp = date.getTime() / 1000
                post = {
                    id: timestamp,
                    title: metadata.title ? metadata.title : "No title given",
                    description: description ? description : "No description given",
                    date: publishedDate ? publishedDate : "No date given",
                    time: parsedDate["time"],
                    type: metadata.type,
                    thumbnail: metadata.thumbnail,
                    videoURL: metadata.videoURL,
                }
                portfolioEntriesList.push(post)
                ilist.push(i)
                if (ilist.length === files.length) {
                    const sortedList = portfolioEntriesList.sort((a, b) => {
                        return a.id < b.id ? 1 : -1
                    })
                    let data = JSON.stringify(sortedList)
                    writeFileSync("src/portfolioEntries.json", data)
                    
                    console.log("portfolios: ",data);
                }
            })
        })
    })
    return
}

const getServicesEntries = () => {
    readdir(dirPathServices, (err, files) => {
        if (err) {
            return console.log("Failed to list contents of directory: " + err)
        }
        let ilist = []
        files.forEach((file, i) => {
            let obj = {}
            let post
            readFile(`${dirPathServices}/${file}`, "utf8", (err, contents) => {
                const getMetadataIndices = (acc, elem, i) => {
                    if (/^---/.test(elem)) {
                        acc.push(i)
                    }
                    return acc
                }
                const parseMetadata = ({ lines, metadataIndices }) => {
                    if (metadataIndices.length > 0) {
                        let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1])
                        metadata.forEach(line => {
                            obj[line.split(": ")[0]] = line.split(": ")[1]
                        })
                        return obj
                    }
                }
                const parseContent = ({ lines, metadataIndices }) => {
                    if (metadataIndices.length > 0) {
                        lines = lines.slice(metadataIndices[1] + 1, lines.length)
                    }
                    return lines.join("\n")
                }
                const lines = contents.split("\n")
                const metadataIndices = lines.reduce(getMetadataIndices, [])
                const metadata = parseMetadata({ lines, metadataIndices })
                const description = parseContent({lines, metadataIndices})
                const parsedDate = metadata.date ? formatDate(metadata.date) : new Date()
                const datestring = `${parsedDate["year"]}-${parsedDate["month"]}-${parsedDate["day"]}T${parsedDate["time"]}:00`
                const date = new Date(datestring)
                const timestamp = date.getTime() / 1000;

                post = {
                    id: timestamp,
                    title: metadata.title ? metadata.title : "No title given",
                    subtext: description ? description : "No subtext given",
                    thumbnail: metadata.thumbnail,
                }
                servicesEntriesList.push(post)
                ilist.push(i)
                if (ilist.length === files.length) {
                    const sortedList = servicesEntriesList.sort((a, b) => {
                        return a.id < b.id ? 1 : -1
                    })
                    let data = JSON.stringify(sortedList)
                    writeFileSync("src/servicesEntries.json", data)
                    
                    console.log("services: ",data);
                }
            })
        })
    })
    return
}

const getHomeEntries = () => {
    readdir(dirPathHome, (err, files) => {
        if (err) {
            return console.log("Failed to list contents of directory: " + err)
        }
        let ilist = []
        files.forEach((file, i) => {
            let obj = {}
            let post
            readFile(`${dirPathHome}/${file}`, "utf8", (err, contents) => {
                const getMetadataIndices = (acc, elem, i) => {
                    if (/^---/.test(elem)) {
                        acc.push(i)
                    }
                    return acc
                }
                const parseMetadata = ({ lines, metadataIndices }) => {
                    if (metadataIndices.length > 0) {
                        let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1])
                        metadata.forEach(line => {
                            obj[line.split(": ")[0]] = line.split(": ")[1]
                        })
                        return obj
                    }
                }
                const parseContent = ({ lines, metadataIndices }) => {
                    if (metadataIndices.length > 0) {
                        lines = lines.slice(metadataIndices[1] + 1, lines.length)
                    }
                    return lines.join("\n")
                }
                const lines = contents.split("\n")
                const metadataIndices = lines.reduce(getMetadataIndices, [])
                const metadata = parseMetadata({ lines, metadataIndices })
                const description = parseContent({lines, metadataIndices})
                const parsedDate = metadata.date ? formatDate(metadata.date) : new Date()
                const datestring = `${parsedDate["year"]}-${parsedDate["month"]}-${parsedDate["day"]}T${parsedDate["time"]}:00`
                const date = new Date(datestring)
                const timestamp = date.getTime() / 1000;

                post = {
                    id: timestamp,
                    title: metadata.title ? metadata.title : "No title given",
                    subtext: description ? description : "No subtext given",
                    thumbnail: metadata.thumbnail,
                }
                homeEntriesList.push(post)
                ilist.push(i)
                if (ilist.length === files.length) {
                    const sortedList = homeEntriesList.sort((a, b) => {
                        return a.id < b.id ? 1 : -1
                    })
                    let data = JSON.stringify(sortedList)
                    writeFileSync("src/homeEntries.json", data)
                    
                    console.log("home: ",data);
                }
            })
        })
    })
    return
}


getPortfolioEntries();
getServicesEntries();
getHomeEntries();
