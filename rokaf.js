const axios = require('axios');
const querystring = require('querystring');

const troops = {
  '기본군사훈련단': {
    siteId: 'last2',
    codyMenuSeq: '156893223'
  },
  '군수1학교': {
    siteId: 'gisool2',
    codyMenuSeq: '157620025'
  },
  '군수2학교': {
    siteId: 'gunsu',
    codyMenuSeq: '157615558'
  },
  '정보통신학교': {
    siteId: 'tong-new',
    codyMenuSeq: '156894686'
  },
  '행정학교': {
    siteId: 'haengjeong',
    codyMenuSeq: '159014200'
  },
  '방공포병학교': {
    siteId: 'bangpogyo',
    codyMenuSeq: '158327574'
  }
};

module.exports = class Rokaf {
  constructor(soldierName, birthDay) {
    this.soldierName = soldierName;
    this.birthDay = birthDay;
    
    this.troop = {
      siteId: 'last2',
      codyMenuSeq: '156893223'
    };
    this.sender = {
      senderZipcode: '06134',
      senderAddr1: '서울특별시 강남구 테헤란로 101',
      senderAddr2: '486층',
      senderName: '윤하',
      relationship: '가수',
      password: '1578'
    };
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      axios.get(`http://www.airforce.mil.kr:8081/user/emailPicViewSameMembers.action?siteId=${ this.troop.siteId }&searchName=${ encodeURI(this.soldierName) }&searchBirth=${ this.birthDay }`)
        .then(res => {
          this.memberSeq = res.data.substring(res.data.indexOf('"resultSelect(\''), res.data.indexOf('\')"')).replace('"resultSelect(\'','');
          
          axios.get(`http://www.airforce.mil.kr:8081/user/indexSub.action?codyMenuSeq=${ this.troop.codyMenuSeq }&siteId=${ this.troop.siteId }&command2=getEmailList&searchName=${ encodeURI(this.soldierName) }&searchBirth=${ this.birthDay }&memberSeq=${ this.memberSeq }`)
            .then(res => {
              this.cookie = res.headers['set-cookie'][0];
              resolve(this.cookie);
            });
        })
        .catch(() => {
          reject(new Error('Not Found.'));
        });
    });
  }
  
  setTroop(name) {
    if(name in troops) {
      this.troop = troops[name];
    }
  }
  
  setSender(config) {
    Object.keys(this.sender).forEach(key => {
      if(key in config) {
        this.sender[key] = config[key];
      }
    });
  }
  
  sendEmail(title, contents) {
    return new Promise(resolve => {
      axios.post('http://www.airforce.mil.kr:8081/user/emailPicSaveEmail.action',
        querystring.stringify(Object.assign(this.sender, {
          command2: 'writeEmail',
          title: title,
          contents: contents,
        })), { headers: { Cookie: this.cookie } })
        .then(() => resolve('Completed.'));
    });
  }
};