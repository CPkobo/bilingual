const fs = require('fs')
const xml2js = require('xml2js')

const mxliffPath = './_local/test.mxliff'
const xliffPath = './_local/test.xliff'

// const xmlStr = fs.readFileSync(xliffPath).toString()
const xmlStr = fs.readFileSync(mxliffPath).toString()
xml2js.parseString(xmlStr, (err, result) => {
    const xliff = result.xliff
    const file = xliff.file[0]
    const body = file.body[0]
    let tus = []
    if (body.group) {
        body.group.map(g => {
            tus.push(...g['trans-unit'])
        })
    }
    else {
        tus.push(...body['trans-unit'])
    }
    tus.forEach(tu => {
        console.log(tu.source)
    })
    fs.writeFileSync(mxliffPath + '.json', JSON.stringify(xliff, null, 2))
    // console.log(xliff.file[0].body[0]['trans-unit'][0].note)
    // console.log(xliff.$)
})