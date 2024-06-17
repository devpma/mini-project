import React, { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  const handleFaqClick = () => {
    setIsActive(!isActive);
  };
  return (
    <li className={`${isActive ? "active" : ""}`} onClick={handleFaqClick}>
      <div className="q-box" onClick={toggleAnswer}>
        {question}
      </div>
      {isOpen && (
        <div className="a-box" dangerouslySetInnerHTML={{ __html: answer }} />
      )}
    </li>
  );
};

const FAQList = () => {
  const faqData = [
    {
      question: "콘텐츠 다운로드가 가능한가요?",
      answer: "컨텐츠 다운로드는 불가능합니다.",
    },
    {
      question: "브라우저 캐시 초기화 방법이 궁금합니다.",
      answer:
        "Chorme (v112 기준)<br />- 브라우저 주소창에 chorme://settings/clearBrowserData 입력 또는 설정 > 개인정보 보호 및 보안 > 인터넷 사용 기록 삭제<br />- 기간 > 전체 기간<br />- 선택 가능한 모든 항목 체크 > 삭제 버튼 클릭<br />- 브라우저 종료<br /><br />MicroSoft Edge (v112 기준) - 브라우저 주소창에 edge://settings/clearBrowserData 입력 또는 설정 > 개인정보, 검색 및 서비스 > 검색 데이터 지우기<br />- 시간 범위 > 모든 시간<br />- 선택 가능한 모든 항목 체크 > 지금 지우기<br />- 브라우저 종료<br /><br />Whale (v3.19.166.16 기준)<br />- 브라우저 주소창에 whale://settings/clearBrowserData 입력 또는 설정 > 개인정보 보호 > 인터넷 사용 기록 삭제 > 기본<br />- 기간 > 전체 기간<br />- 선택 가능한 모든 항목 체크 > 삭제 버튼 클릭<br />- 브라우저 종료<br /><br />Safari (v15.6.1 기준)<br />- 환경 설정 > 개인정보 보호 > 웹사이트 데이터 관리 > 모두 제거 > 완료<br />- 브라우저 종료<br /><br />Firefox (v109 기준)<br />- 브라우저 주소창에 about:preferences#privacy 입력 또는 설정 > 개인정보 및 보안 > 쿠키 및 사이트 데이터 > 데이터 지우기<br />- 브라우저 종료<br /><br /><br />이용에 참고해 주시기 바랍니다.",
    },
    {
      question: "맥 사용자도 이용할 수 있나요?",
      answer: "맥 사용자도 MOVIE COLLECTION을 이용하실 수 있습니다.",
    },
    {
      question: "위시리스트 이용방법이 궁금합니다.",
      answer:
        "목록, 상세페이지에 있는 하트버튼을 눌러 활성화시킵니다. <br />우측 상단의 프로필 아이콘을 눌러 위시리스트 메뉴를 클릭합니다.",
    },
    {
      question: "모바일로도 이용이 가능한가요?",
      answer: "모바일 기기로도 MOVIE COLLECTION을 이용하실 수 있습니다.",
    },
    // 다른 FAQ 항목들도 추가할 수 있습니다
  ];

  return (
    <div className="CScenter-wrap">
      <h1>CS CENTER</h1>
      <div className="CScenter-box">
        <ul className="faq">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FAQList;
