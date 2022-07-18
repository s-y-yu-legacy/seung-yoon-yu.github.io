// 로컬 스토리지에 배열을 저장합니다.
let discussionString = JSON.stringify(agoraStatesDiscussions);
let discussionJson = JSON.parse(localStorage.getItem("data"));

// convertToDiscussion은 아고라 스테이츠 데이터를 DOM으로 바꿔줍니다.
const convertToDiscussion = (obj) => {
    const li = document.createElement("li"); // li 요소 생성
    li.className = "discussion__container"; // 클래스 이름 지정

    const avatarWrapper = document.createElement("div");
    avatarWrapper.className = "discussion__avatar--wrapper";
    const discussionContent = document.createElement("div");
    discussionContent.className = "discussion__content";
    const discussionAnswered = document.createElement("div");
    discussionAnswered.className = "discussion__answered";

    // TODO: 객체 하나에 담긴 정보를 DOM에 적절히 넣어주세요.
    const avatarImg = document.createElement('img');
    avatarImg.className = "discussion__avatar--img";
    avatarImg.src = obj.avatarUrl;
    avatarImg.alt = 'avatar of ' + obj.author;
    avatarWrapper.append(avatarImg);

    const title = document.createElement('div');
    title.className = "discussion__content--title"
    title.innerHTML = `<a href="${obj.url}">${obj.title}</a>`;
    discussionContent.append(title);

    const answerAndAuthor = document.createElement('div');
    answerAndAuthor.className = "discussion__content--answerAndAuthor--wrapper";
    discussionContent.append(answerAndAuthor);

    const answerChecker = obj.answer;
    const answer = document.createElement('span');
    if (answerChecker === null) {
        answer.innerHTML = `<span>Unanswered</span>`;
        answer.className = 'discussion__content--unanswered';
    }
    if (answerChecker) {
        answer.innerHTML = `<span>Answered</span>`;
        answer.className = 'discussion__content--answered';
    }
    answerAndAuthor.append(answer);

    const author_createdAt = document.createElement('div');
    const createdTime = function(t) {
        //2022-05-16T02:09:52Z formatting
        const year = t.slice(0, 4);
        const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const nth = Number(t.slice(5, 7)) - 1;
        const day = t.slice(8, 10);
        const time = t.slice(11, 13);
        const min = t.slice(14, 16);
        const sec = t.slice(17, 19);
        if (23 >= time && time >= 12) {
            return `${month[nth]} ${day} ${time - 12}:${min} PM`;
        }
        if (12 > time && time >= 0) {
            return `${month[nth]} ${day} ${time}:${min} AM`;
        }
    }
    author_createdAt.className = "discussion__content--author--createdAt"
    author_createdAt.innerHTML = `<span>${obj.author} · ${createdTime(obj.createdAt)}</span>`;
    answerAndAuthor.append(author_createdAt);

    li.append(avatarWrapper, discussionContent);
    return li;
};

// agoraStatesDiscussions 배열의 모든 데이터를 화면에 렌더링하는 함수입니다.
const render = (element) => {
    for (let i = 0; i < discussionJson.length; i += 1) {
        element.append(convertToDiscussion(discussionJson[i]));
    }
    return;
};

// ul 요소에 agoraStatesDiscussions 배열의 모든 데이터를 화면에 렌더링합니다.
const ul = document.querySelector("ul.discussions__container");
render(ul);

// 폼 입력값을 agoraStatesDiscussions 배열에 추가하고, 로컬 스토리지를 다시 셋팅한 뒤, 화면에 추가하는 함수입니다.
const form = document.querySelector('#form');
const formName = document.querySelector('#name');
const formTitle = document.querySelector('#title');
const formStory = document.querySelector('#story');
const formBtn = document.querySelector('#submit');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    agoraStatesDiscussions.unshift({
        id: formName.value,
        createdAt: new Date().toISOString(),
        title: formTitle.value,
        url: '',
        author: formName.value,
        answer: null,
        bodyHTML: formStory.value,
        avatarUrl: 'https://avatars.githubusercontent.com/u/12145019?s=64&u=5c97f25ee02d87898457e23c0e61b884241838e3&v=4'
    });
    discussionString = JSON.stringify(agoraStatesDiscussions)
    localStorage.setItem("data", discussionString);
    discussionJson = JSON.parse(localStorage.getItem("data"));
    ul.prepend(convertToDiscussion(discussionJson[0]));
});

// 페이지네이션 관련입니다.