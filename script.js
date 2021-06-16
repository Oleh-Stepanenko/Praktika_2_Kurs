
const ajaxReq = new XMLHttpRequest();                     //Создание самого запроса

ajaxReq.onloadend = () => {
  const result = ajaxReq.responseText;
  const answer = JSON.parse(result);
  const rankingBody = document.querySelector("#accordionExample");     //Получаем в доступ к DIV  внутри WRAPPER

  let female = 0;
  let male = 0;

  answer.results.map((user, idx) => {                       //Формируеться массив с значениями полученными из ответа сервера 

    let PersonGender = [user.gender];                     //Подсчёт количества определённых гендеров методом прохода через массив пользователей
    PersonGender.forEach(Person => {
      if (Person == 'female') {
        female++;
      }
      else {
        male++;
      }
    });



    const id = user.location.street.number;

    console.log(`[${idx}] ==> ${user}`);

    const register = new Date(user.registered.date);    //Нормальный вывод регистрации
    year = register.getFullYear();
    month = register.getMonth() + 1;
    dt = register.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    const RegisterDate = month + '/' + dt + '/' + year;



    const birthday = new Date(user.dob.date);             //Нормальный вывод даты рождения
    year_birthday = birthday.getFullYear();
    month_birthday = birthday.getMonth() + 1;
    dt_birthday = birthday.getDate();

    if (dt_birthday < 10) {
      dt_birthday = '0' + dt_birthday;
    }
    if (month_birthday < 10) {
      month_birthday = '0' + month_birthday;
    }

    const Birthday_Date = month_birthday + '/' + dt_birthday + '/' + year_birthday;

    const btnIsCollapsed = 'collapsed';
    const showSubRow = '';
    //Создаём переменную в которую записываем код блока вывода который хотим в дальнейшем пересоздавать
    const resultHTML = `                               
            <h2 class="accordion-header" id="heading${id}">
              <button class="accordion-button ${btnIsCollapsed} ${(idx) % 2 ? 'grey' : 'white'}"
                type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse${id}"
                aria-expanded="true"
                aria-controls="collapse${id}">

                <div class="row">
                    <div class="col-1">
                        <img src="${user.picture.medium}">
                    </div>
                    <div class="col">
                        <p>${user.name.last}</p>
                    </div>
                    <div id="name-search" class="col search">
                        <p id="names">${user.name.first}</p>
                    </div>
                    <div class="col">
                        <p>${user.login.username}</p>
                    </div>
                    <div class="col">
                        <p>${user.cell}</p>
                    </div>
                    <div class="col">
                        <p>${user.location.city}</p>
                    </div>
                    <div class="col-1">
                        <div></div>
                    </div>
                 </div>
              </button>
            </h2>

            <div id="collapse${id}"
              class="accordion-collapse collapse ${showSubRow}"
              aria-labelledby="heading${id}"
              data-bs-parent="#accordionExample">

              <div class="accordion-body ${btnIsCollapsed} ${(idx) % 2 ? 'grey' : 'white'}"">
              <div class="ACCORDION_BODY_NAME">
                <p>Name:${user.name.first}</p>
                <p>Gender:${user.gender}</p>
              </div>

              <div class="ACCORDION_BODY_MAIN">
                <div class="ACCORDION_BODY_FIRST">
                    <p>Username: ${user.login.username}</p>
                    <p>Registered: ${RegisterDate}</p>
                    <p>Email: ${user.email}</p>
                </div>


                <div class="ACCORDION_BODY_SECOND">
                    <p>Address: ${user.location.street.number} ${user.location.street.name}</p>
                    <p>City: ${user.location.city}</p>
                    <p>Zip code: ${user.location.postcode}</p>
                </div>

                <div class="ACCORDION_BODY_THIRD">
                    <p>Birthday: ${Birthday_Date}</p>
                    <p>Phone: ${user.phone}</p>
                    <p>Call: ${user.cell}</p>
                </div>

                <div class="ACCORDION_BODY_PICTURE">
                    <img src="${user.picture.large}">
                </div>
            </div>
            </div>

            </div>
        `;


    var newDiv = document.createElement("div");           //Создаём контейнер в котором будет находиться HTML код который мы записали выше

    newDiv.className = 'accordion-item';
    newDiv.innerHTML = resultHTML;

    rankingBody.insertAdjacentElement('beforeend', newDiv);

  });
  let CountUsers = male + female;                         //Подсчёт людей по гендеру
  let AllMale = (male / CountUsers) * 100;
  let AllFemale = (female / CountUsers) * 100;


  var colors = Highcharts.getOptions().colors,            //Построение графика
    categories = [
      'Male',
      'Female'
    ],
    data = [
      {
        y: AllMale,
        color: colors[1],
        drilldown: {
          name: 'Male',
          categories: [
          ],
          data: [
          ]
        }
      },
      {
        y: AllFemale,
        color: colors[0],
        drilldown: {
          name: 'Female',
          categories: [
          ],
          data: [
          ]
        }
      }
    ],
    salaryData = [],
    percentageData = [],
    i,
    j,
    dataLen = data.length,
    drillDataLen,
    brightness;

  // Build the data arrays
  for (i = 0; i < dataLen; i += 1) {

    // add browser data
    salaryData.push({
      name: categories[i],
      y: data[i].y,
      color: data[i].color
    });
  }

  // Create the chart
  Highcharts.chart('container', {
    chart: {
      type: 'pie'
    },
    title: {
      text: null
    },
    subtitle: {
      text: null
    },
    plotOptions: {
      pie: {
        shadow: false,
        center: ['50%', '50%'],
        startAngle: -90
      }
    },
    tooltip: {
      valueSuffix: '%'
    },
    series: [{
      name: 'Percentage',
      data: salaryData,
      size: '80%',
      dataLabels: {
        formatter: function () {
          return this.y > 5 ? this.point.name : null;
        },
      }
    }, {
      name: 'Percentage',
      data: percentageData,
      size: '80%',
      innerSize: '100%',
      dataLabels: {
        formatter: function () {
          // display only if larger than 1
          return this.y > 1 ? '<b>' + this.point.name + '</b> ' : null;
        }
      },
      id: 'percentages'
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 400
        },
        chartOptions: {
          series: [{
          }, {
            id: 'percentages',
            dataLabels: {
              enabled: false
            }
          }]
        }
      }]
    }
  });
}

ajaxReq.open('GET', 'https://randomuser.me/api/?results=10', true);    //Открытые и отправление запроса
ajaxReq.send();


window.onload = () => {                                   //Поиск пользователя по полю его имени

  let input = document.querySelector('#search');

  input.oninput = function (event) {

    const value = event.target.value;
    let list = document.querySelectorAll('.accordion-item');
    let nameSearch = document.querySelectorAll('#name-search');

    console.log('nameSearch', nameSearch);

    if (value) {
      list.forEach((elem) => {
        const rr = elem.querySelectorAll('#name-search');
        const nn = rr[0].innerText;
        if (nn.search(value) == -1) {
          elem.classList.add('hide');
        }
      });

    } else {
      list.forEach(elem => {
        elem.classList.remove('hide');
      })
    }
    console.log(this.value);
  }

};


