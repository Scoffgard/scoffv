import { useEffect, useState } from "react";

import MenuOption from "../components/MenuOption";

import '../styles/pages/Menu.scss';

const maxValuesByPage = 9;

export default function Menu(props) {

  const [menuState, setMenuState] = useState(false);

  const [title, setTitle] = useState('Default Title');

  const [currentPage, setCurrentPage] = useState('');

  const [currentOption, setCurrentOption] = useState(0);

  const [currentScroll, setCurrentScroll] = useState(0);
  
  const [localHistory, setLocalHistory] = useState([]);

  const [pages, setPages] = useState({
    'home': {
      'title': 'Welcome on ScoffV !',
      'options': [
        // {
        //   'type': 'button',
        //   'label': 'A simple button',
        //   'eventName': 'browser:menu-interact:home-button-Asimplebutton',
        // },
        // {
        //   type: 'divider',
        //   'label': 'TEST',
        // },
        // {
        //   'type': 'button',
        //   'label': 'A simple button',
        //   'eventName': 'browser:menu-interact:home-button-Asimplebutton',
        //   'desc': 'I have a desc'
        // },
        // {
        //   'type': 'confirm',
        //   'label': 'A simple button (with confirm)',
        //   'focus': false,
        //   'eventName': 'browser:menu-interact:home-confirm-Asimplebutton',
        // },
        // {
        //   'type': 'link',
        //   'label': 'A link to nothing',
        //   'route': 'test',
        // },
        // {
        //   'type': 'checkbox',
        //   'label': 'Wanna see the result ?',
        //   'value': false,
        //   'eventName': 'browser:menu-interact:home-checkbox-Wannaseetheresult',
        // },
        // {
        //   'type': 'input',
        //   'label': 'Select me to enter some text',
        //   'value': 'reger',
        //   // 'regexMatch': /[a-zA-Z]/,
        //   'eventName': 'browser:menu-interact:home-input-Selectmetoentersometext',
        // },
        // {
        //   'type': 'color',
        //   'label': 'Select me to enter some color',
        //   'value': {r: 255, g: 128, b:128},
        //   'eventName': 'blalbla',
        //   'preserveValue': true,
        // },
        // {
        //   'type': 'number',
        //   'label': 'Choose a number',
        //   'min': 0,
        //   'max': 20,
        //   'allowRotation': true,
        //   'value': 0,
        //   'eventName': 'browser:menu-interact:home-number-Chooseanumber',
        // },
        // {
        //   'type': 'number',
        //   'label': 'Choose a number 2',
        //   'min': 0,
        //   'max': 20,
        //   'allowRotation': false,
        //   'value': 0,
        //   'eventName': 'browser:menu-interact:home-number-Chooseanumber2',
        // },
      ],
    },
    // 'test': {
    //   'title': 'Weapons',
    //   'options': [
    //     {
    //       'type': 'button',
    //       'label': 'Click me !',
    //       'eventName': () => {console.log(localHistory)}
    //     },
    //     {
    //       'type': 'link',
    //       'label': 'A link to nothing 2',
    //       'route': 'weapons2',
    //     },
    //   ]
    // },
    // 'weapons2': {
    //   'title': 'Weapons',
    //   'options': [
    //     {
    //       'type': 'button',
    //       'label': 'Click me !',
    //       'eventName': () => {console.log(localHistory)}
    //     }
    //   ]
    // },
  });

  const generatePage = () => {
    if (!currentPage || !pages[currentPage]) return;
    
    const page = pages[currentPage];

    let options = [];
    for (let index = currentScroll; index <= maxValuesByPage+currentScroll && index < page.options.length; index++) {
      let option = page.options[index]
      options.push(
        <MenuOption 
          key={`${currentPage}-${index}`}
          type={option.type}
          label={option.label}
          value={option.value}
          setValue={(val) => {
            const newPages = {...pages};
            newPages[currentPage].options[index].value = val;
            setPages(newPages); 
          }}
          min={option.min}
          max={option.max}
          allowRotation={option.allowRotation}
          selected={currentOption == index}
          focus={option.focus}
        />
      )
    }

    return options;
  }

  const moveOption = (optionSelected, currentOption, currentScroll, way) => {
    if (way == -1) {
      if (optionSelected.type === 'input' && optionSelected.focus) return;
      if (currentOption == 0) {
        setCurrentOption(pages[currentPage].options.length-1);
        if (pages[currentPage].options.length-1 >= maxValuesByPage)
          setCurrentScroll(pages[currentPage].options.length-1-maxValuesByPage);
        return {option: pages[currentPage].options.length-1, scroll: pages[currentPage].options.length-1-maxValuesByPage};
      }
      else setCurrentOption(currentOption-1);
      if (currentOption <= currentScroll) {
        setCurrentScroll(currentScroll-1);
        return {option: currentOption-1, scroll: currentScroll-1}
      }
      return {option: currentOption-1, scroll: currentScroll};
    } else {
      if (optionSelected.type === 'input' && optionSelected.focus) return;
      if (currentOption == pages[currentPage].options.length-1) {
        setCurrentOption(0);
        setCurrentScroll(0);
        return {option: 0, scroll: 0};
      }
      else setCurrentOption(currentOption+1);
      if (currentOption >= currentScroll + maxValuesByPage) {
        setCurrentScroll(currentScroll+1);
        return {option: currentOption+1, scroll: currentScroll+1}
      }
      return {option: currentOption+1, scroll: currentScroll};
    }
  }

  const navigate = (page, back = false) => {
    if (!pages[page]) return;

    setCurrentOption(0);
    setCurrentScroll(0);
    setTitle(pages[page].title);
    setCurrentPage(page);

    if (page == 'home') return setLocalHistory([]);

    const newlocalHistory = [...localHistory];

    if (back) newlocalHistory.pop();
    else newlocalHistory.push(page);

    setLocalHistory(newlocalHistory);
  }

  const registerPage = (route, title) => {
    const newPages = {...pages};
    newPages[route] = { title, options: []};
    setPages(newPages);

    if (window.mp) window.mp.events.call(`browser:menu-done:registerPage-${route}`)
  }

  const registerOption = (route, type, label, eventName, optionProps = {}) => {
    const newPages = {...pages};
    newPages[route].options.push({
      type,
      label,
      eventName,
      ...JSON.parse(optionProps),
    });
    setPages(newPages);
  }

  const deletePage = (route, linkRoute = null) => {
    const newPages = {...pages};
    delete newPages[route];
    if (linkRoute) newPages[linkRoute].options = newPages[linkRoute].options.filter(o => o.route != route);
    setPages(newPages);
  }

  const clearOptions = (route) => {
    const newPages = {...pages};
    newPages[route].options = [];
    setPages(newPages);
  }

  useEffect(() => {
    navigate('home');
  }, []);

  useEffect(() => {
    if (window.mp) {
      window.mp.events.add('browser:menu:registerPage', registerPage);
      window.mp.events.add('browser:menu:registerOption', registerOption);
      window.mp.events.add('browser:menu:deletePage', deletePage);
      window.mp.events.add('browser:menu:clearOptions', clearOptions);
      window.mp.events.add('browser:menu:navigate', navigate);
      return () => {
        window.mp.events.remove('browser:menu:registerPage', registerPage);
        window.mp.events.remove('browser:menu:registerOption', registerOption);
        window.mp.events.remove('browser:menu:deletePage', deletePage);
        window.mp.events.remove('browser:menu:clearOptions', clearOptions);
        window.mp.events.remove('browser:menu:navigate', navigate);
      }
    }
  }, [pages, localHistory]);

  useEffect(() => {
    const keydownEvent = (e) => {
      const optionSelected = pages[currentPage].options[currentOption];

      if (e.key === 'm' && !(optionSelected.type == 'input' && optionSelected.focus)) {
        if (window.mp) mp.events.call('browser:menu:active', !menuState);
        return setMenuState(!menuState);
      }
      
      if (!menuState) return;

      let newOption;

      switch (e.key) {
        case 'ArrowDown': 
          newOption = moveOption(optionSelected, currentOption, currentScroll, 1);
          if (newOption != undefined && pages[currentPage].options[newOption.option].type === 'divider')
            moveOption(pages[currentPage].options[newOption.option], newOption.option, newOption.scroll, 1);
          break;
        case 'ArrowUp': 
          newOption = moveOption(optionSelected, currentOption, currentScroll, -1);
          if (newOption != undefined && pages[currentPage].options[newOption.option].type === 'divider')
            moveOption(pages[currentPage].options[newOption.option], newOption.option, newOption.scroll, -1);
          break;
        case 'ArrowRight': 
          if (optionSelected.type == 'number') {
            let newVal;
            if (optionSelected.value == optionSelected.max && optionSelected.allowRotation) newVal = optionSelected.min;
            else if (optionSelected.value == optionSelected.max && !optionSelected.allowRotation) break;
            else newVal = parseFloat((optionSelected.value + (Number(optionSelected.step) || 1)).toFixed(4));
            const newPages = {...pages};
            newPages[currentPage].options[currentOption].value = newVal;
            setPages(newPages);

            if (window.mp) mp.events.call('browser:menu-interact', optionSelected.eventName, optionSelected.value);
          }
          break;
        case 'ArrowLeft': 
          if (optionSelected.type == 'number') {
            let newVal;
            if (optionSelected.value == optionSelected.min && optionSelected.allowRotation) newVal = optionSelected.max;
            else if (optionSelected.value == optionSelected.min && !optionSelected.allowRotation) break;
            else newVal = parseFloat((optionSelected.value - (Number(optionSelected.step) || 1)).toFixed(4));
            const newPages = {...pages};
            newPages[currentPage].options[currentOption].value = newVal;
            setPages(newPages);

            if (window.mp) mp.events.call('browser:menu-interact', optionSelected.eventName, optionSelected.value);
          }
          break;
        case 'Enter': 
          if (optionSelected.type == 'divider') break;
          if (optionSelected.type == 'link') navigate(optionSelected.route);

          if (optionSelected.type == 'checkbox') {
            const newPages = {...pages};
            newPages[currentPage].options[currentOption].value = !newPages[currentPage].options[currentOption].value;
            setPages(newPages);
          }

          if (optionSelected.type == 'input' || optionSelected.type == 'color') {
            const newPages = {...pages};
            if (!optionSelected.focus) {
              if (optionSelected.type != 'color') newPages[currentPage].options[currentOption].value = '';
              if (window.mp) mp.events.call('browser:menu:lockControls', true);
              if (window.mp && optionSelected.type == 'color') mp.events.call('browser:menu:lockMouse', true);
            } else if (window.mp) {
              mp.events.call('browser:menu:lockControls', false);
              if (optionSelected.type == 'color') mp.events.call('browser:menu:lockMouse', false);
            }
            newPages[currentPage].options[currentOption].focus = !newPages[currentPage].options[currentOption].focus;
            setPages(newPages);
            if (optionSelected.focus || optionSelected.value == '') return;
          }

          if (optionSelected.type == 'confirm') {
            const newPages = {...pages};
            newPages[currentPage].options[currentOption].focus = !newPages[currentPage].options[currentOption].focus;
            setPages(newPages);
            if (optionSelected.focus) return;
          }

          if (window.mp) mp.events.call(
            'browser:menu-interact',
            optionSelected.eventName,
            typeof optionSelected.value == "object" ?
            JSON.stringify(optionSelected.value) :
            optionSelected.value
          );
          break;
        case 'Backspace': 
          if (optionSelected.type === 'input' && optionSelected.focus) {
            const newPages = {...pages};
            const oldValue = newPages[currentPage].options[currentOption].value;
            newPages[currentPage].options[currentOption].value = oldValue.substring(0, oldValue.length - 1);
            setPages(newPages);
            return;
          }
        case 'Escape':
          if (optionSelected.type === 'input' && optionSelected.focus) {
            const newPages = {...pages};
            newPages[currentPage].options[currentOption].focus = false;
            newPages[currentPage].options[currentOption].value = '';
            setPages(newPages);
            if (window.mp) mp.events.call('browser:menu:lockControls', false);
            return;
          }

          if (localHistory.length > 1) navigate(localHistory[localHistory.length-2], true);
          else if (localHistory.length == 1) navigate('home', true);
          else {
            if (window.mp) mp.events.call('browser:menu:active', !menuState);
            setMenuState(false);
          }
          break;
        default: 
          if (optionSelected.type === 'input' && optionSelected.focus && e.key.length == 1) {
            if (optionSelected.regexMatch && !(new RegExp(optionSelected.regexMatch)).test(e.key)) return;
            if (optionSelected.maxLen && optionSelected.value.length+1 > optionSelected.maxLen) return;
            const newPages = {...pages};
            newPages[currentPage].options[currentOption].value += e.key;
            setPages(newPages);
          }
      }
    }

    window.addEventListener('keydown', keydownEvent);
  
    return () => {
      window.removeEventListener('keydown', keydownEvent);
    }
  }, [currentPage, currentOption, localHistory, pages, menuState, currentScroll]);

  return (
    <div className={`menuWrapper ${menuState ? '' : 'hidden'}`}>
      <div className={`menu`}>
        <h1>{title}</h1>
        {generatePage()}
      </div>
      { pages[currentPage]?.options[currentOption]?.desc &&
        <div className="desc">
          {pages[currentPage]?.options[currentOption]?.desc}
        </div>
      }
    </div>
  )
}