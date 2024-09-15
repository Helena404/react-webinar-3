/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = {
      ...initState,
      maxCode: initState.list.reduce((max, item) => Math.max(max, item.code), 0),
      usedCodes: new Set(initState.list.map(item => item.code)), // Храним использованные коды
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
   * Генерация уникального кода
   * @returns {number}
   */
  generateUniqueCode() {
    let newCode = this.state.maxCode + 1;
    while (this.state.usedCodes.has(newCode)) {
      newCode += 1;
    }
    this.state.usedCodes.add(newCode); // Добавляем новый код в сет использованных
    this.state.maxCode = newCode; // Обновляем максимальный код
    return newCode;
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const newCode = this.generateUniqueCode();

    this.setState({
      ...this.state,
      list: [...this.state.list, { code: newCode, title: 'Новая запись', selectionCount: 0 }],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.state.usedCodes.delete(code); // Удаляем код из сета использованных
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
        if (item.code === code) {
          return {
            ...item,
            selected: !item.selected,
            selectionCount: item.selected ? item.selectionCount : (item.selectionCount || 0) + 1,
          };
        }
        return {
          ...item,
          selected: false,
        };
      }),
    });
  }

  /**
   * Форматирование фразы с правильной формой слова "раз"
   * @param count {number}
   * @returns {string}
   */
  formatSelectionCount(count) {
    if (count === 1) return '1 раз';
    if (count >= 2 && count <= 4) return `${count} раза`;
    return `${count} раз`;
  }
}

export default Store;
