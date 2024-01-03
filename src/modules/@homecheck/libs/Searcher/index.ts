import _ from 'lodash'

function englishSearch(keyword : string, searchList : string[]) {
    // 검색어 입력하여 검색어 전용 정규식 생성
    const regex = FuzzyMatcherEnglish(keyword);

    let searched = []
    for (let key of searchList) {
        regex.test(key) ? searched.push(key) : null
    }
    return searched
}


  
  
 export const Search = (keyword : string, searchList : string[]) => {
    const regex = FuzzyMatcher(keyword.replaceAll(" ",""));
    
    let matched = []; 
    for(let key of searchList){
      regex.test(key) ? matched.push(key) : null
    }
    return matched
  }

  export const SearchProperty = (keyword : string, property : string, searchList : string[]) =>{
    const regex = FuzzyMatcher(excludeCharacters(keyword).replaceAll(" ",""));
    return searchList.filter((item)=> regex.test(_.get(item,property)))
  }
  



// 1. 특수문자 처리
const escapeRegExp = (text : string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const excludeCharacters = (str : string) =>{  
    var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    //특수문자 검증
    if(reg.test(str)){
      //특수문자 제거후 리턴
      return str.replace(reg, "");    
    } else {
      //특수문자가 없으므로 본래 문자 리턴
      return str;
    }  
  }

// 2. 퍼지 문자열 검색을 위한 정규식 생성
const FuzzyMatcherEnglish = (text :string) => {
    const pattern = text.split("").map(escapeRegExp).join(".*?");
    return new RegExp(pattern);
};

// 퍼지 문자열 검색을 위한 정규식 생성
const FuzzyMatcher = (input :string) => {
    const pattern = input.split("").map(ch2pattern).join(".*?");
    return new RegExp(pattern);
  }

const ch2pattern = (ch :string)=> {
    // 사용자가 초성만 입력한 경우
    if (/[ㄱ-ㅎ]/.test(ch)) {
      const chToBegin = {
        ㄱ: "가".charCodeAt(0),
        ㄲ: "까".charCodeAt(0),
        ㄴ: "나".charCodeAt(0),
        ㄷ: "다".charCodeAt(0),
        ㄸ: "따".charCodeAt(0),
        ㄹ: "라".charCodeAt(0),
        ㅁ: "마".charCodeAt(0),
        ㅂ: "바".charCodeAt(0),
        ㅃ: "빠".charCodeAt(0),
        ㅅ: "사".charCodeAt(0),
        ㅆ: "싸".charCodeAt(0),
        ㅇ: "아".charCodeAt(0),
        ㅈ: "자".charCodeAt(0),
        ㅊ: "차".charCodeAt(0),
        ㅋ: "카".charCodeAt(0),
        ㅌ: "타".charCodeAt(0),
        ㅍ: "파".charCodeAt(0),
        ㅎ: "하".charCodeAt(0),
      };
      const begin = chToBegin[ch];
      const end = begin + 587;
      return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
    }
    // 사용자가 초성+중성 또는 초성+중성+종성을 입력한 경우
    else if (/[가-히]/.test(ch)) {
      const offset = "가".charCodeAt(0);
      const chCode = ch.charCodeAt(0) - offset;
      // 사용자가 초성+중성을 입력한 경우
      if (chCode % 28 <= 0) {
        const begin = Math.floor(chCode / 28) * 28 + offset;
        const end = begin + 27;
        return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
      }
      // 사용자가 초성+중성+종성을 입력한 경우
      else return ch;
    }
    // 한글이 입력되지 않은 경우
    else return escapeRegExp(ch);
  }
