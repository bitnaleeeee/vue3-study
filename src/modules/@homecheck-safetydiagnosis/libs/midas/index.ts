function escapeRegExp(string : string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(text: string, oldValue: string, newValue: string) {
  return text.replace(new RegExp(escapeRegExp(oldValue), "g"), newValue);
}

export const parseMidasData  = (midas: string)  => {
  const seperator = `==================================================================================================================`;

  const properties = [
    "MEMB",
    "Section",
    "Name",
    "fck",
    "fy",
    "CHK",
    "pPn-max",
    "Pu",
    "MF_y",
    "Mcy",
    "Mcz",
    "LCB1",
    "Vu.end",
    "Rat-V.end",
    "SECT",
    "Bc",
    "Hc",
    "Height",
    "fys",
    "LCB2",
    "V-Rebar",
    "Rat-P",
    "MF_z",
    "Rat-My",
    "Rat-Mz",
    "LCB3",
    "Vu.mid",
    "Rat-V.mid",
  ];

  let ONLY_DATA_ROWs = midas.split(seperator).filter((parseString) => {
    let element = parseString.split("------------------------------------------------------------------------------------------------------------------");
    element = element.filter((text) => !text.includes("------------------------------") && text != "\n");
    element = element.filter((text) => !text.includes("KDS") && !text.includes(" MEMB  Section Name"));
    return element.length > 0;
  });

  const output = [];
  for (let filtered of ONLY_DATA_ROWs) {
    let element = filtered
      .split("------------------------------------------------------------------------------------------------------------------")
      .filter((text) => !text.includes("------------------------------") && text != "\n")
      .map((text) => {
        return text
          .split(`\n`)
          .filter((_text) => _text)
          .map((_text) => replaceAll(_text, "|", ""))
          .map((_text) => {
            return _text.split(" ").filter((_text) => _text != "");
          });
      })
      .map((parse) => {
        const output : {[key in string] : string} = {};
        for (let i = 0; i < properties.length; i++) {
          if (i < 14) {
            output[properties[i]] = parse[0][i];
          } else if (i == 20) {
            output[properties[i]] = `${parse[1][i - 14]} ${parse[1][i - 13]}`;
          } else if (i < 20) {
            output[properties[i]] = `${parse[1][i - 14]}`;
          } else {
            output[properties[i]] = `${parse[1][i - 13]}`;
          }
        }
        return output;
      });

    output.push(...element);
  }
  return output;
};

// 마이다스 데이터 분석하는 함수만 만들면됨