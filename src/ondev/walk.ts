import { readFileSync } from 'fs'
import { parseString, Builder } from 'xml2js';

type VisitorFunc = (text: string, memo: string) => string



export class XliffProc {
  public srcLang: string
  public tgtLang: string[]
  public contents: TranslationContent[]

  constructor() {
    this.srcLang = ''
    this.tgtLang = [] as string[]
    this.contents = [] as TranslationContent[]
  }

  public loadMultilangXml(path: string, process: 'read' | 'write'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const xmlStr = readFileSync(path).toString()
      const fileName = path.toLowerCase()
      if (fileName.endsWith('mxliff')) {
        this.loadMxliffString(path, xmlStr)
          .then(() => {
            resolve(true)
          })
          .catch(e => {
            reject(e)
          })
      }
      else if (fileName.endsWith('.xliff')) {
        this.loadMxliffString(path, xmlStr).then(() => {
          resolve(true)
        }).catch(e => {
          reject(e)
        })
      }
      else if (fileName.endsWith('.tmx')) {
        // this.fileNames.push(fileName)
        this.loadTmxString(path, xmlStr).then(() => {
          resolve(true)
        }).catch(e => {
          reject(e)
        })
      }
      else if (fileName.endsWith('.tbx')) {
        // this.fileNames.push(fileName)
        this.loadTbxString(path, xmlStr).then(() => {
          resolve(true)
        }).catch(e => {
          reject(e)
        })
      }
      else {
        reject('This Program only support "MXLIFF", "XLIFF", "TMX" and "TBX" files')
      }
    })
  }

  private loadMxliffString(xliffName: string, data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      parseString(data, (err: Error | null, xliff: XliffLoaded) => {
        if (err !== null) {
          reject(err)
        }
        else {
          const xliffTag = xliff.xliff || [{}];
          const files = xliffTag.file || []
          files.forEach(file => {
            this.contents.push(this.xliffFielExtract(file))
          })
          resolve(true);
        }
      })
    })
  }

  private updateMxliffString(xliffName: string, data: string): Promise<XliffLoaded> {
    return new Promise((resolve, reject) => {
      
    })
  }

  private xliffFielExtract(file: XliffFileStructure): TranslationContent {
    const content: TranslationContent = {
      file: file.$.original,
      alllangs: new Set(),
      units: []
    }
    const srcLang = file.$['source-language'] || ''
    content.alllangs.add(srcLang)
    const tgtLang = file.$['target-language'] || ''
    content.alllangs.add(tgtLang)
    const body = file.body[0];
    const tusStruct: XliffTransUnitStructure[][] = 
      body.group ? body.group.map(val => val['trans-unit'])
        : body['trans-unit'] ? [body['trans-unit']]
          : []
    tusStruct.forEach(tus => {
      tus.forEach(tu => {
        const unit: TranslationUnit[] = []
        unit.push({
          lang: srcLang,
          text: tu.source[0]
        })
        unit.push({
          lang: tgtLang,
          text: tu.target[0]
        })
        content.units.push(unit)
      })
    })
    return content
  }

  private 

  private loadTmxString(name: string, data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      parseString(data, (err: Error | null, tmx: any) => {
        if (err !== null) {
          console.log(err)
          reject(false)
        } else {
          const header = tmx.tmx.header || [];
          const body = tmx.tmx.body || [{}];
          if (header.length === 0 || body.length === 0) {
            reject('empty content')
          } else {
            const headerAttr = header[0].$
            const srcLang = headerAttr.srclang
            this.langs[0] === srcLang
            const tus = body[0].tu || []
            const content: {
              file: string
              units: TranslationUnit[][];
            } = {
              file: name,
              units: []
            }
            for (const tu of tus) {
              const tuvs = tu.tuv || []
              const units: TranslationUnit[] = []
              for (const tuv of tuvs) {
                const lang = tuv.$['xml:lang']
                if (this.langs.indexOf(lang) === -1) {
                  this.langs.push(lang)
                }
                const text = tuv.seg.join('')
                if (text !== '') {
                  units.push({ lang, text })
                }
                content.units.push(units)
              }
            }
            this.contents.push(content)
            resolve(true);
          }
        }
      })
    })
  }

  private loadTbxString(name: string, data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      parseString(data, (err: Error | null, tbx: any) => {
        if (err !== null) {
          console.log(err)
          reject(err)
        } else {
          const martifTag = tbx.martif || [{}];
          const textTag = martifTag.text || [{}];
          const bodyTag = textTag[0].body || [{}];
          const termEntries = bodyTag[0].termEntry || []
          if (termEntries.length === 0) {
            reject('empty content')
          } else {
            const content: {
              file: string
              units: TranslationUnit[][];
            } = {
              file: name,
              units: []
            }
            for (const termEntry of termEntries) {
              const units: TranslationUnit[] = [];
              for (const langSet of termEntry.langSet) {
                const lang = langSet.$['xml:lang'];
                if (this.langs.indexOf(lang) === -1) {
                  this.langs.push(lang);
                }
                const tig = langSet.tig || [{}];
                const term = tig[0].term || [];
                const text = term.join('');
                if (text !== '') {
                  units.push({ lang, text });
                }
              }
              content.units.push(units)
            }
            this.contents.push(content)
            resolve(true);
          }
        }
      })
    })
  }

  public walker(xml: string, vistor: VisitorFunc): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true)
      reject()
    })
  }
}