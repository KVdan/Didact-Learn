/**
 * @format
 * @jsx Didact.createElement
 */

const element = (
	<div id='foo'>
		<a> bar </a>
		<b />
	</div>
);
const container = document.getElementById('root');
ReactDOM.render(element, container);

/******************************************************************/
// Didact库对JSX语句的解析结果

const element = React.createElement(
	'div',
	{id: 'foo'},
	React.createElement('a', null, 'bar'),
	React.createElement('b')
);
const container = document.getElementById('root');
ReactDOM.render(element, container);

// use the rest parameter syntax for the children
function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props, // use the spread operator for the props
			children,
		},
	};
}

// 正是因为这样的写法，确保children returned是一个array

// 现在考虑ReactDOM.render的构造机理
function render(element, container) {
	// create DOM node using the elment type
	const dom = element.type == 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);

	// assign the element props to the node
	const isProperty = (key) => key !== 'children';
	Object.key(element.props)
		.filter(isProperty)
		.forEach((name) => (dom[name] = element.props[name]));

	// do the same thing for each children recursively
	element.props.children.forEach((child) => {
		render(child, dom);
	});

	// add the new node to the container
	container.appendChild(dom);
}

function workLoop(deadline) {
	let shouldYield = false;
	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
		shouldYield = deadline.timeRemaining() < 1;
	}
	requestIdleCallback(workLoop); // We use requestIdleCallback to make a loop. You can think of requestIdleCallback as a setTimeout, but instead of us telling it when to run, the browser will run the callback when the main thread is idle.
}
