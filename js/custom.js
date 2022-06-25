function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();

// =================================================================
// Начало - "Бургер"
// =================================================================

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}

};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let i = 0; i < menuArrows.length; i++) {
			const menuArrow = menuArrows[i];
			menuArrow.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}
} else {
	document.body.classList.add('_pc');
}

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');

if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}

// =================================================================
// Конец - "Бургер"
// =================================================================

// =================================================================
// Начало - "Денамический адаптив"
// =================================================================

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

// =================================================================
// Конец - "Денамический адаптив"
// =================================================================


// =================================================================
// Начало - "маска"
// =================================================================

document.addEventListener("DOMContentLoaded", function () {

	var eventCalllback = function (e) {

		var el = e.target,
		clearVal = el.dataset.phoneClear,
		pattern = el.dataset.phonePattern,
		matrix_def = "+7(___) ___-__-__",
		matrix = pattern ? pattern : matrix_def,
		i = 0,
		def = matrix.replace(/\D/g, ""),
		val = e.target.value.replace(/\D/g, "");

		if (clearVal !== 'false' && e.type === 'blur') {
			if (val.length < matrix.match(/([\_\d])/g).length) {
				e.target.value = '';
				return;
			}
		}
		if (def.length >= val.length) val = def;
		e.target.value = matrix.replace(/./g, function (a) {
			return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
		});
	}

	var phone_inputs = document.querySelectorAll('[data-phone-pattern]');
	for (let elem of phone_inputs) {
		for (let ev of ['input', 'blur', 'focus']) {
			elem.addEventListener(ev, eventCalllback);
		}
	}
});
/*
const FormOne =  document.querySelector('._form-one');
const FormOnePlaceholder = FormOne.placeholder;

if (FormOne) {
	FormOne.addEventListener("focus", function (e) {
		FormOne.placeholder = "";
	});
	FormOne.addEventListener("blur", function (e) {
		FormOne.placeholder = FormOnePlaceholder;
	});
}
*/

const FormOne =  document.querySelector('._form-one');
const FormOnePlaceholder = FormOne.placeholder;

if (FormOne) {
	FormOne.addEventListener("focus", function (e) {
		FormOne.placeholder = "";
	});
	FormOne.addEventListener("blur", function (e) {
		FormOne.placeholder = FormOnePlaceholder;
	});
}

const FormTwo =  document.querySelector('._form-two');
const FormTwoPlaceholder = FormOne.placeholder;

if (FormTwo) {
	FormTwo.addEventListener("focus", function (e) {
		FormTwo.placeholder = "";
	});
	FormTwo.addEventListener("blur", function (e) {
		FormTwo.placeholder = FormTwoPlaceholder;
	});
}

const FormThree =  document.querySelector('._form-three');
const FormThreePlaceholder = FormOne.placeholder;

if (FormThree) {
	FormThree.addEventListener("focus", function (e) {
		FormThree.placeholder = "";
	});
	FormThree.addEventListener("blur", function (e) {
		FormThree.placeholder = FormThreePlaceholder;
	});
}

// =================================================================
// Конец - "маска"
// =================================================================



// =================================================================
// Начало - "попап"
// =================================================================


const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 1000;

if (popupLinks.length > 0) {
	for (let i = 0; i < popupLinks.length; i++) {
		const popupLink = popupLinks[i];
		popupLink.addEventListener("click", function (e){
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let i = 0; i < popupCloseIcon.length; i++) {
		const el = popupCloseIcon[i];
		el.addEventListener('click', function (e){
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wraper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let i = 0; i < lockPadding.length; i++) {
			const el = lockPadding[i];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let i = 0; i < lockPadding.length; i++) {
				const el = lockPadding[i];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}


// =================================================================
// Конец - "попап"
// =================================================================


// =================================================================
// Начало - "валидация форм"
// =================================================================


const ButtonOne = document.querySelector('._button-one');
const InputBodyOne = document.querySelector('._input-body-one');
const InputTextOne = document.querySelector('._input-text_one');
const InputNumberOne = document.querySelector('._input-number_one');


if (ButtonOne) {
	ButtonOne.addEventListener("click", function (e) {
		let inputTextOneValue = InputTextOne.value;
		let inputNumberOneValue = InputNumberOne.value;
		let popapOne = document.querySelector('._popup-one');

		if (inputTextOneValue) {
			if (inputNumberOneValue) {
				popapOne.classList.toggle('open');
				bodyLock();
				let timerId = setTimeout(function tick() {
					let formOne = document.querySelector('#_formOne');
					formOne.submit();
				}, 1500);
			} else {
				InputBodyOne.classList.toggle('_error');
				let timerId = setTimeout(function tick() {
					InputBodyOne.classList.remove('_error');
				}, 2000);
			}
		} else {
			InputBodyOne.classList.toggle('_error');
			let timerId = setTimeout(function tick() {
				InputBodyOne.classList.remove('_error');
			}, 2000);
		}
	});
}

const ButtonTwo = document.querySelector('._button-two');
const InputBodyTwo = document.querySelector('._input-body-two');
const InputTextTwo = document.querySelector('._input-text_two');
const InputNumberTwo = document.querySelector('._input-number_two');
const InputTextareaTwo = document.querySelector('._input-textarea_two');


if (ButtonTwo) {
	ButtonTwo.addEventListener("click", function (e) {
		let inputTextTwoValue = InputTextTwo.value;
		let inputNumberTwoValue = InputNumberTwo.value;
		let popapOne = document.querySelector('._popup-one');
		let popapTwo = document.querySelector('._popup-two');

		if (inputTextTwoValue) {
			if (inputNumberTwoValue) {
				popapTwo.classList.remove('open');
				popapOne.classList.toggle('open');
				//bodyLock();
				let timerId = setTimeout(function tick() {
					let formTwo = document.querySelector('#_formTwo');
					formTwo.submit();
				}, 1500);
			} else {
				InputBodyTwo.classList.toggle('_error');
				let timerId = setTimeout(function tick() {
					InputBodyTwo.classList.remove('_error');
				}, 2000);
				alert("9");
			}
		} else {
			InputBodyTwo.classList.toggle('_error');
			let timerId = setTimeout(function tick() {
				InputBodyTwo.classList.remove('_error');
			}, 2000);
		}
	});
}



const ButtonThree = document.querySelector('._button-three');
const InputBodyThree = document.querySelector('._input-body-three');
const InputTextThree = document.querySelector('._input-text_three');
const InputNumberThree = document.querySelector('._input-number_three');


if (ButtonThree) {
	ButtonThree.addEventListener("click", function (e) {
		let inputTextThreeValue = InputTextThree.value;
		let inputNumberThreeValue = InputNumberThree.value;
		let popapOne = document.querySelector('._popup-one');
		let popapThree = document.querySelector('._popup-three');

		if (inputTextThreeValue) {
			if (inputNumberThreeValue) {
				popapThree.classList.remove('open');
				popapOne.classList.toggle('open');
				bodyLock();
				let timerId = setTimeout(function tick() {
					let formThree = document.querySelector('#_formThree');
					formThree.submit();
				}, 1500);
			} else {
				InputBodyThree.classList.toggle('_error');
				let timerId = setTimeout(function tick() {
					InputBodyThree.classList.remove('_error');
				}, 2000);
			}
		} else {
			InputBodyThree.classList.toggle('_error');
			let timerId = setTimeout(function tick() {
				InputBodyThree.classList.remove('_error');
			}, 2000);
		}
	});
}
// =================================================================
// Конец - "валидация форм"
// =================================================================