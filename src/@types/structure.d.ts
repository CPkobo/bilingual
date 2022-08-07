interface XliffLoaded {
  xliff: XliffStructure
}

interface XliffStructure {
  '$': {
    xmlns: string
    version: string
    [attrs: string]: string
  },
  file: XliffFileStructure[],
}

interface XliffFileStructure {
  '$': {
    id: string
    original: string
    'source-language': string
    'target-language': string
    datatype: string
    [attrs: string]: string
  }
  header?: XliffHeaderStructure[]
  body: XliffBodyStructure[]
}

interface XliffHeaderStructure {
  tool: XliffHeaderToolStructure[]
}

interface XliffHeaderToolStructure {
  '$': {
    'tool-id': string
    'tool-name': string
    'tool-version': string
    [attrs: string]: string
  }
}

interface XliffBodyStructure {
  group?: XliffGroupStructure[]
  'trans-unit'?: XliffTransUnitStructure[]
}

interface XliffGroupStructure {
  '$': {
    id: string
    [attrs: string]: string
  }
  'context-group': XliffContextStructure[]
  'trans-unit': XliffTransUnitStructure[]
}

interface XliffContextStructure {
  context: Array<{
    _: string
    $: {
      'context-type': string
      [attrs: string]: string
    }
  }>
}

interface XliffTransUnitStructure {
  '$': {
    id: string
    [attrs: string]: string
  }
  source: string[]
  target: string[]
  'alt-trans'?: XliffAltTransStructure[]
  note: XliffTransUnitNoteStructure[]
}

interface XliffAltTransStructure {
  $: {
    origin: string
    'match-quality': string
  }
  target: string[]
}

interface XliffTransUnitNoteStructure {
  '_': string
  '$': {
    from: string
    priority: string
  }
}