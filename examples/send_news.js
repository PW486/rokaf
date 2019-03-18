const navernews = require('navernews');
const daumsportsnews = require('daumsportsnews');
const namuwiki = require('namuwiki');
const rokaf = require('rokaf');

const soldier = new rokaf('가나다', '19700101');
soldier.setTroop('정보통신학교');

const sender = {
  senderZipcode: '06134',
  senderAddr1: '서울특별시 강남구 테헤란로 101',
  senderAddr2: '486층',
  senderName: '뉴스배달원',
  relationship: '지인',
  password: '486'
};
soldier.setSender(sender);

async function sendNews(startDate, day) {
  const now = new Date(startDate);
  
  for(let i=0; i<day; i++) {
    await navernews(now).then(contents => {
      console.log(contents);
      soldier.sendEmail('네이버 많이 본 뉴스 (' + now.toISOString().slice(0,10) + ')', contents);
    });
    await daumsportsnews(now).then(contents => {
      console.log(contents);
      soldier.sendEmail('다음 스포츠 뉴스 (' + now.toISOString().slice(0,10) + ')', contents);
    });
    
    now.setDate(now.getDate()+1);
  }
}

async function main() {
  await soldier.connect();
  
  await sendNews('2018/08/20', 15);

  namuwiki().then(res => {
    if (res) {
      if(res.contents.length > 1000 && res.contents.length < 10000) {
        console.log(res.title);
        
        let split = res.contents.match(/.{1,1111}/g);
        for(let i = 0; i < split.length; i++) {
          soldier.sendEmail(res.title + ' - ' + (i+1), split[i]);
        }
      }
    }
  });
}

main();