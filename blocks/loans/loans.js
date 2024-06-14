const SELECTORS = {
  tabsSelector: '.tab',
};

const API_URL = {
  Different_Home_Loan_Url: 'https://main--eds--aryanjha12.hlx.live/different_type_of_loan/query-index.json',
};

const CREATE_SELECTOR_CLASS = {
  contentContainer: 'content-container',
  tabsContainer: 'tabs-container',
  titleContainer: 'different-loans-title',
};

const AUTHORABLE_VALUES = {
  loansTitle: 'Different Types of Loans',
};

function createTitle(block) {
  const title = document.createElement('h1');
  title.textContent = AUTHORABLE_VALUES.loansTitle;
  title.className = CREATE_SELECTOR_CLASS.titleContainer;
  block.appendChild(title);
}

function createTabs(block) {
  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add(CREATE_SELECTOR_CLASS.tabsContainer);
  block.appendChild(tabsContainer);

  const tabNames = ['All', 'Housing', 'Business'];
  tabNames.forEach((tabName) => {
    const tab = document.createElement('button');
    tab.classList.add('tab');
    tab.textContent = tabName;
    tab.dataset.tabName = tabName.toLowerCase();
    tabsContainer.appendChild(tab);
  });

  return tabsContainer;
}

function createContentContainer(block) {
  const contentContainer = document.createElement('div');
  contentContainer.classList.add(CREATE_SELECTOR_CLASS.contentContainer);
  block.appendChild(contentContainer);
  return contentContainer;
}

function handleLoanTab(tabName, contentContainer, data) {
  contentContainer.textContent = `Loading ${tabName} data...`;

  let filteredData;
  if (tabName === 'all') {
    filteredData = data;
  } else {
    filteredData = data.filter((item) => item.category.toLowerCase() === tabName);
    console.log(filteredData);
  }

  if (filteredData.length > 0) {
    contentContainer.innerHTML = filteredData.map((item) => `
  <a href="${item.url}" class="loan-card">
    <img src="${item.image}" alt="${item.title}" class="loan-image"/>
    <div class="loan-content">
      <h2 class="loanTitle">${item.title}</h2>
      <p class="loanDescription">${item.description}</p>
    </div>
  </a>
        `).join('');
  } else {
    contentContainer.textContent = `No data available for ${tabName}.`;
  }
}

async function fetchData() {
  const responseData = await fetch(API_URL.Different_Home_Loan_Url);
  const dataObj = await responseData.json();
  if (!responseData.ok) {
    console.log('Api is not getting response');
  }
  return dataObj.data; // Ensure we return the correct part of the response
}

function addEventListeners(tabsContainer, contentContainer) {
  const tabs = tabsContainer.querySelectorAll(SELECTORS.tabsSelector);
  console.log('tabs are', tabs);
  tabs.forEach((tab) => {
    tab.addEventListener('click', async () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      try {
        const dataObj = await fetchData();
        handleLoanTab(tab.dataset.tabName, contentContainer, dataObj);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    });
  });

  // It shows first tab always on load
  tabs[0].classList.add('active');
}

export default async function decorate(block) {
  createTitle(block);
  const tabsContainer = createTabs(block);
  const contentContainer = createContentContainer(block);
  addEventListeners(tabsContainer, contentContainer);

  try {
    const responseData = await fetchData();
    console.log(responseData);
    // Initially load content for the first tab
    handleLoanTab('all', contentContainer, responseData);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}
