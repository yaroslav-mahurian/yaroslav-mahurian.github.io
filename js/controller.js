var controller = (function (budgetCtrl, uiCtrl) {



    var setupEventListeners = function () {
        var DOM = uiCtrl.getDOMStrings();
        document.querySelector(DOM.form).addEventListener("submit", ctrlAddItem);

        // Клик по таблице с доходами и расходами
        document.querySelector(DOM.budgetTable).addEventListener("click", ctrlDeleteItem);
    };

    // Обновляем проценты по каждой записи
    function updatePercentages() {

        // 1. Посчитать проценты для каждой записи типа Expense
        budgetCtrl.calculatePercentages();

        // 2. Получаем данные по процентам с модели
        var idsAndPercents = budgetCtrl.getAllIdsAndPercentages();

        // 3. Обновить UI с новыми процентами
        uiCtrl.updateItemsPercetages(idsAndPercents);
    }

    // Ф-ция срабатыватывающая при отправки формы 
    function ctrlAddItem(event) {
        event.preventDefault();
        // 1. Получить данные из формы
        var input = uiCtrl.getInput();

        // Проверка что поля не пустые
        if (input.description != "" && !isNaN(input.value) && input.value > 0) {
            // 2. Добавить полученные данные в модель
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Добавить запись в UI
            uiCtrl.renderListItem(newItem, input.type);

            // Убрать в финальной версии
            uiCtrl.clearFields();
            // generateTestData.init();

            // 4. Посчитать бюджет 
            updateBudget();

            // 5. Посчитать проценты
            updatePercentages();

        } // endIf

    }

    function ctrlDeleteItem(event) {
        var itemID, splitID, type, ID;

        if (event.target.closest(".item__remove")) {

            // Находим ID записи которую надо удалить
            itemID = event.target.closest("li.budget-list__item").id;

            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Удаляем запись из модели
            budgetCtrl.deleteItem(type, ID);

            // Удаляем запись из шаблона
            uiCtrl.deleteListItem(itemID);

            // Посчитать бюджет 
            updateBudget();

            // Посчитать проценты
            updatePercentages();
        }
    }

    function updateBudget() {
        // 1. Расчитать бюджет в модели
        budgetCtrl.calculateBudget();
        // 2. Получить расчитанный бюджет из модели
        budgetObj = budgetCtrl.getBudget();
        // 3. Отобразить бюджет в Шаблоне
        uiCtrl.updateBudget(budgetObj);
    }


    return {
        init: function () {
            uiCtrl.displayMonth();
            setupEventListeners();
            uiCtrl.updateBudget({
                budget: 0,
                totalIncome: 0,
                totalExp: 0,
                percentage: 0
            });
        }
    };



})(modelController, viewController);

controller.init();