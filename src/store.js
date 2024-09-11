/**
 * Хранилище состояния приложения
 */
class Store {
	constructor(initState = {}) {
	  this.state = {
		...initState,
		maxCode: initState.list.reduce((max, item) => Math.max(max, item.code), 0), // Определяем максимальный код на основе текущего списка
	  };
	  this.listeners = [];
	}

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const newCode = this.state.maxCode + 1;

    this.setState({
      ...this.state,
      list: [...this.state.list, { code: newCode, title: 'Новая запись' }],
      maxCode: newCode,
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
	this.setState({
	  ...this.state,
	  list: this.state.list.map(item => {
		// Если код совпадает, инвертируем выделение и увеличиваем счетчик
		if (item.code === code) {
		  return {
			...item,
			selected: !item.selected,
			// Увеличиваем счетчик только если выделяем элемент
			selectionCount: item.selected ? item.selectionCount : (item.selectionCount || 0) + 1,
		  };
		}
		// Снимаем выделение с остальных записей
		return {
		  ...item,
		  selected: false,
		};
	  }),
	});
  }
}

export default Store;
