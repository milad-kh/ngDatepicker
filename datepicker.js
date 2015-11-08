(function(ng)
{
  'use strict';
  var
  init = function()
  {
    ng
    .module('ishiadatepicker', [])
    .directive('ishiaDatepicker', ['$document', '$templateCache', '$templateRequest', '$compile', directiveProvider])
  },
  directiveProvider = function($document, $templateCache, $templateRequest, $compile)
  {
    var
    link = function(scope, elm, attr)
    {
      var
        calendarType = attr.ishiaDatepicker,
        j=0,
        result=0,
        i=0,
        tempM,
        currentDateArray,
        m,
        t,
        row,
        coloumn,
        btn,
        dateString,
        remainingNumbers = [1,5,9,13,17,22,26,30],
        parsiDigits =['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'],
        parsiDigit;
        if (calendarType == 'jalaali')
        {
          scope.weekDay = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
          scope.MonthArray = ['فروردین', 'اردیبهشت' , 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
        }
        else
        {
          scope.weekDay = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          scope.MonthArray = ['January', 'February', 'March', 'April', 'May', 'June',	'July',	'August',	'September', 'October',	'November',	'December'];
        }

      scope.convertToParsiDigit = function(dayNumber)
      {
        var digits = dayNumber.toString().split('');
        parsiDigit = '';
        for(var i = 0;i<digits.length; i++)
        {
          parsiDigit += parsiDigits[digits[i]];
        }
        return parsiDigit;
      }
      //  create current date string
      scope.closeCalendar = function()
      {
        if(document.getElementById(scope.parentID))
          document.getElementById(scope.parentID).remove();
      };

      var
      firstInitialize = function()
      {
        console.info('firstInitialize');
        if (calendarType == 'jalaali')
          tempM = moment().format('jYYYY/jM/jD/jdddd');
        else
          tempM = moment().format('YYYY/M/D/dddd');
        currentDateArray = tempM.split('/');
        dateString = currentDateArray[0] + '/' + currentDateArray[1] + '/1';
        if (calendarType == 'jalaali')
          m = moment(dateString, 'jYYYY/jM/jD/jdddd');
        else
          m = moment(dateString, 'YYYY/M/D/dddd');
        if (calendarType == 'jalaali')
          scope.currentYear = m.jYear();
        else
          scope.currentYear = m.year();
        //
        if (calendarType == 'jalaali')
          var x = moment(dateString, 'jYYYY/jM/jD');
        else
          var x = moment(dateString, 'YYYY/M/D');
        var y = x.format('dddd');
        console.warn('start at:', y);
        //
        if (calendarType == 'jalaali')
          scope.currentMonthIndex = m.jMonth();
        else
          scope.currentMonthIndex = m.month();
        if (calendarType == 'jalaali')
          scope.numberOfDaysInMonth = daysInMonth(scope.currentMonthIndex);
        else
          scope.numberOfDaysInMonth = m.daysInMonth(scope.currentMonthIndex);
        dateString = scope.currentYear + '/' + scope.currentMonthIndex + '/' + '1';
        console.info('currentMonthIndex: ', scope.currentMonthIndex);
        console.info('monthFirstDayOfWeek: ',monthFirstDayOfWeek(y));
        console.info('numberOfDaysInMonth: ',scope.numberOfDaysInMonth);
        console.info('numberOfWeeksInMonth: ',numberOfWeeksInMonth(monthFirstDayOfWeek(y)));
        scope.monthFirstDayOfWeek = monthFirstDayOfWeek(y);
      },
      monthFirstDayOfWeek = function(dayname)
      {
        switch (dayname.toLowerCase())
        {
          case 'saturday':
            return 0;
            break;
          case 'sunday':
            return 1;
            break;
          case 'monday':
            return 2;
            break;
          case 'tuesday':
            return 3;
            break;
          case 'wednesday':
            return 4;
            break;
          case 'thursday':
            return 5;
            break;
          case 'friday':
            return 6;
            break;
        }
      },

      numberOfWeeksInMonth = function(startDay)
      {
        console.info('startDaY: ', startDay);
        switch (startDay)
        {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            return 5;
            break;
          case 6:
            return 6;
            break;
        }
      },

      render4HTML = function()
      {
        console.info('render4HTML');
        var k =0;
        var j =0;

        var dynamicPart = document.createElement("table");
        if(attr.ishiaDatepicker == 'jalaali')
        {
          dynamicPart.style.direction = "rtl";
        }
        else
        {
          dynamicPart.style.direction = "ltr";
        }
        dynamicPart.setAttribute("class", "datepicker-days-wrap");
        dynamicPart.setAttribute("id", scope.parentID + "dynamicPart");

        var dynamicPartTHead = document.createElement("thead");
        var dynamicPartTHeadTr = document.createElement("tr");
        dynamicPartTHead.appendChild(dynamicPartTHeadTr);
        dynamicPart.appendChild(dynamicPartTHead);
        for(var i=0;i<7;i++)
        {
          var th = document.createElement('th');
          th.innerHTML = scope.weekDay[i];
          dynamicPartTHeadTr.appendChild(th);
        }

        var dynamicPartTBody = document.createElement("tbody");
        dynamicPart.appendChild(dynamicPartTBody);

        for(var i = 0 ; i < numberOfWeeksInMonth(scope.monthFirstDayOfWeek) ; i++)
        {
          var tr = document.createElement('tr');
          for(var j = 0 ; j < 7 ; )
          {
            var td = document.createElement('td');
            // create button for each day
            if(i == 0 && j >= scope.monthFirstDayOfWeek)
              k++;
            if(i > 0)
              k++;
            if(k > 0 && k <= scope.numberOfDaysInMonth)
            {
              if(calendarType == 'jalaali')
              {
                td.innerHTML = scope.convertToParsiDigit(k);
              }
              else
              {
                td.innerHTML = k;
              }
              if (k == currentDateArray[2] && (currentDateArray[1] == (scope.currentMonthIndex + 1) ) )
              {
                td.setAttribute("class", "datepicker-today");
              }
              td.setAttribute("ng-click", "setDate(" + k + ")");
              $compile(td)(scope);
            }
            else
            {
              td.innerHTML = '';
              td.setAttribute("class", "datepicker-other-month");
            }
            tr.appendChild(td);
            j ++
          }
          dynamicPartTBody.appendChild(tr);
        }
        var pr = document.getElementById(scope.parentID);
        console.log('bache ha:', pr.children.length);
        pr.insertBefore(dynamicPart, pr.childNodes[pr.children.length - 1]);
    },

    createID = function()
    {
      if (scope.parentID)
      {
        scope.closeCalendar();
      }
      scope.parentID = '_' + Math.random().toString(36).substr(2, 9);
      return scope.parentID;
    },

    daysInMonth = function(monthIndex)
    {
      switch (monthIndex) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          return 31;
          break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
          return 30;
          break;
        case 11:
          var currentRemain = scope.currentYear % 33;
          if (remainingNumbers.indexOf(currentRemain) == -1)
          {
            console.info('natural');
            return 29;
          }
          else
          {
            console.info('leap');
            return 30;
          }
          break;
      }
    },

    calendarInitialize = function()
    {
      dateString = scope.currentYear + '/' + (scope.currentMonthIndex + 1) + '/' + '1';
      console.info('calendarInitialize: ', dateString);
      if (calendarType == 'jalaali')
        m = moment(dateString, 'jYYYY/jM/jD/jdddd');
      else
        m = moment(dateString, 'YYYY/M/D/dddd');
      if (calendarType == 'jalaali')
        var x = moment(dateString, 'jYYYY/jM/jD');
      else
        var x = moment(dateString, 'YYYY/M/D');
      var y = x.format('dddd');
      console.warn('start at:', y);
      if (calendarType == 'jalaali')
        scope.monthFirstDayOfWeek = m.jMonth();
      else
        scope.monthFirstDayOfWeek = m.month();
      if (calendarType == 'jalaali')
        scope.numberOfDaysInMonth = daysInMonth(scope.currentMonthIndex);
      else
        scope.numberOfDaysInMonth = m.daysInMonth(scope.currentMonthIndex);
      scope.monthFirstDayOfWeek = monthFirstDayOfWeek(y);
      console.info('monthFirstDayOfWeek: ',scope.monthFirstDayOfWeek);
      console.info('numberOfDaysInMonth: ',scope.numberOfDaysInMonth);
      console.info('numberOfWeeksInMonth: ',numberOfWeeksInMonth(scope.monthFirstDayOfWeek));
      document.getElementById(scope.parentID + "dynamicPart").remove();
      render4HTML();
    };

    elm.bind('click', function(){
      console.info('datePicker');
      scope.datePicker();
      scope.$apply();
    });

    scope.datePicker = function()
    {
      var tempParent = document.createElement("div");
      tempParent.setAttribute("id", createID());
      tempParent.setAttribute("class", "iShia-datepicker");
      tempParent.style.left = elm[0].offsetLeft + "px";
      console.info(elm[0].offsetHeight + elm[0].offsetTop + "px");
      tempParent.style.top = elm[0].offsetHeight + elm[0].offsetTop + "px";
      //////////////////////////////////////////////
      // create close button
      var tempCloseButtonDiv = document.createElement("div");
      tempCloseButtonDiv.setAttribute("class","datepicker-close-btn");
      var tempCloseButton = document.createElement("button");
      tempCloseButton.setAttribute("ng-click","closeCalendar();");
      tempCloseButton.setAttribute("class","fa fa-times");
      tempCloseButtonDiv.appendChild(tempCloseButton);
      //////////////////////////////////////////////
      // create YEAR row
      var tempYearRow = document.createElement("div");
      tempYearRow.setAttribute("class", "datepicker-year");
      var yearTempButton1 = document.createElement("button");
      yearTempButton1.setAttribute("class", "datepicker-ctrl-btn fa fa-chevron-left datepicker-pre");
      yearTempButton1.setAttribute("ng-click", "goPreviousYear()");
      var yearTempSpan = document.createElement("span");

      yearTempSpan.innerHTML = "{{currentYear}}";
      // yearTempSpan.innerHTML = scope.convertToParsiDigit(yearTempSpan.innerHTML);

      var yearTempButton2 = document.createElement("button");
      yearTempButton2.setAttribute("ng-click", "goNextYear()");
      yearTempButton2.setAttribute("class", "datepicker-ctrl-btn fa fa-chevron-right datepicker-next");
      tempYearRow.appendChild(yearTempButton1);
      tempYearRow.appendChild(yearTempSpan);
      tempYearRow.appendChild(yearTempButton2);
      //////////////////////////////////////////////
      // create MONTH row
      var tempMonthRow = document.createElement("div");
      tempMonthRow.setAttribute("class", "datepicker-month");
      var monthTempButton1 = document.createElement("button");
      monthTempButton1.setAttribute("class", "datepicker-ctrl-btn fa fa-chevron-left datepicker-pre");
      monthTempButton1.setAttribute("ng-click", "goPreviousMonth()");
      var monthTempSpan = document.createElement("span");
      monthTempSpan.innerHTML = "{{MonthArray[currentMonthIndex]}}";
      var monthTempButton2 = document.createElement("button");
      monthTempButton2.setAttribute("ng-click", "goNextMonth()");
      monthTempButton2.setAttribute("class", "datepicker-ctrl-btn fa fa-chevron-right datepicker-next");
      tempMonthRow.appendChild(monthTempButton1);
      tempMonthRow.appendChild(monthTempSpan);
      tempMonthRow.appendChild(monthTempButton2);
      /////////////////////////////////////////////
      // today's date
      var todayDate = document.createElement("div");
      todayDate.setAttribute("class", "datepicker-date-today");
      var todayDateSpan = document.createElement("span");
      todayDateSpan.setAttribute("class", "datepicker-icon fa fa-calendar");
      todayDateSpan.innerHTML = 'today: ';
      todayDate.appendChild(todayDateSpan);
      /////////////////////////////////////////////
      // append created elements to their parent
      tempParent.appendChild(tempCloseButtonDiv);
      tempParent.appendChild(tempYearRow);
      tempParent.appendChild(tempMonthRow);
      tempParent.appendChild(todayDate);
      /////////////////////////////////////////////
      // compile and render
      var compiledTemplate = $compile(tempParent);
      var content = compiledTemplate(scope);
      var body = angular.element($document[0].body);

      body.append(content);
      firstInitialize();
      render4HTML();
    }

    scope.setDate = function(day)
    {
      scope.dateString = scope.currentYear + '-' + (scope.currentMonthIndex + 1) + '-' + day;
      var formatedDate = moment(scope.dateString).format(attr.format.toString());
      scope.dateString = formatedDate;
      scope.closeCalendar();
    }

    scope.prepareDay = function()
    {
      result = i ++;
      if(result < scope.monthFirstDayOfWeek)
      {
        console.info(j);
        return (0);
      }
      else
      {
        return ++j;
      }
    }

    scope.goNextMonth = function()
    {
      if (scope.currentMonthIndex == 11)
      {
        scope.currentMonthIndex = 0;
        scope.currentYear ++;
      }
      else
        scope.currentMonthIndex ++;
      calendarInitialize();
    }

    scope.goPreviousMonth = function()
    {
      if (scope.currentMonthIndex == 0)
      {
        scope.currentMonthIndex = 11;
        scope.currentYear --;
      }
      else
        scope.currentMonthIndex --;
      calendarInitialize();
    }

    scope.goNextYear = function()
    {
        scope.currentYear ++;
        calendarInitialize();
    }

    scope.goPreviousYear = function()
    {
        scope.currentYear --;
        calendarInitialize();
    }

    if(scope.opendefault)
      scope.datePicker();
    /////////////////////////////////////////////////////////////////////////
    };
    return {
      restrict: 'A',
      link: link,
      scope:{
        dateString: "=ngModel",
        opendefault: "="
      }
    }
  }
  ;
  init();

})(this.angular);
