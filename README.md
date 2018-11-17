# rokaf [![Build Status](https://travis-ci.com/PW486/rokaf.svg?branch=master)](https://travis-ci.com/PW486/rokaf)
> Send a letter to a [**ROK Air Force**](http://airforce.mil.kr:8081/user/indexSub.action?codyMenuSeq=147914674&siteId=atc&menuUIType=top) soldier.

## Installation
Available on [npm](http://npmjs.org/). To install it:
```bash
$ npm i rokaf
```

## Quick Start
```js
const rokaf = require('rokaf');
 
let soldier = new rokaf('고윤하', '19880429'); // 수신자, 생년월일
soldier.connect().then(() => soldier.sendEmail('제목', '내용'));
```

## Basic Usage
```js
const rokaf = require('rokaf');
 
let soldier = new rokaf('고윤하', '19880429'); // 수신자, 생년월일
 
soldier.setTroop('기본군사훈련단'); // 부대이름
 
let sender = {
  senderZipcode: '06134', // 우편번호
  senderAddr1: '서울특별시 강남구 테헤란로 101', // 주소
  senderAddr2: '486층', // 상세주소
  senderName: '윤하', // 발신자
  relationship: '가수', // 관계
  password: '1578' // 비밀번호
};
soldier.setSender(sender);
 
soldier.connect().then(() => {
  soldier.sendEmail('제목', '내용').then(res => {
    console.log(res); // Completed.
  });
});
```

### Troop List
* 기본군사훈련단
* 군수1학교
* 군수2학교
* 정보통신학교
* 행정학교
* 방공포병학교
```js
soldier.setTroop('기본군사훈련단'); // 부대이름
```

### Sender Setting
```js
let sender = {
  senderZipcode: '06134', // 우편번호
  senderAddr1: '서울특별시 강남구 테헤란로 101', // 주소
  senderAddr2: '486층', // 상세주소
  senderName: '윤하', // 발신자
  relationship: '가수', // 관계
  password: '1578' // 비밀번호
};
soldier.setSender(sender);
```

## Advanced Usage

### Send Popular Naver News
```js
const rokaf = require('rokaf');
const navernews = require('navernews');
 
let soldier = new rokaf('고윤하', '19880429');
 
async function sendNews(startDate, day) {
  let now = new Date(startDate);
  
  for(let i = 0; i < day; i++) {
    await navernews(now).then(contents => {
      console.log(contents);
      soldier.sendEmail('네이버 많이 본 뉴스 (' + now.toISOString().slice(0,10) + ')', contents);
    });
    
    now.setDate(now.getDate()+1);
  }
};

async function main() {
  await soldier.connect();
  sendNews('2018/08/20', 7); // (2018/08/20 ~ 2018/08/26)
};

main();
```

### Send Namuwiki Contents
```js
const rokaf = require('rokaf');
const namuwiki = require('namuwiki');
 
let soldier = new rokaf('고윤하', '19880429');
 
async function main() {
  await soldier.connect();
  
  namuwiki().then(res => {
    if (res) {
      console.log(res.title);
      if(res.contents.length > 1000 && res.contents.length < 10000) {
        let split = res.contents.match(/.{1,1111}/g);
        
        for(let i = 0; i < split.length; i++) {
          soldier.sendEmail(res.title + ' - ' + (i+1), split[i]);
        }
      }
    }
  });
};

main();
```

## LICENSE
[MIT](https://github.com/PW486/navernews/blob/master/LICENSE)