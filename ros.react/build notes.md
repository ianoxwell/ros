# ROS react version of Recipe ordering simplified

## Tools used

* React with react router dom
* [Vite](https://mantine.dev/guides/vite/)
* [Mantine](https://mantine.dev/getting-started/) 

## SPA setup

[Responsive Layout Setup](https://mahdikarimipour.com/blog/spa-layout)

### Creation

`npm create vite@latest`
`npm install @mantine/core @mantine/hooks @mantine/form @mantine/dates dayjs @mantine/notifications @mantine/modals`

## Self notes on React

* Note that a react component should start with a Capital letter
* have component files start with a capital
* then use the es7 react snippets to `rafc` -> it will auto create the arrowed const
* a react jsx MUST return a SINGLE web element - can use fragment though `<>` or `<React.Fragment>`
* When wanting to do similar to ng-transclude (pass info between the tag), then property in child component must be `children`
* Ensure that when you are map in the template that you pass in key as a unique identifier on the object - index is not enough, especially if you are dealing with lists that change
* Can instead pass a spread operator instead of individual properties, such as `return <Book {...book} key={book.id} />` where book = `{ title='Elle', author='Elle Macpherson}`

### Hooks

* `useState` - anything starting with use is a hook
* `useState(value)` - is [variableName, setVariableName] - such as `const [count, setCount] = useState<boolean>(0);` where 0 is the initial value or the mounting/render value
* Hooks must be invoked inside the component (e.g. within the const MyComponent = () => { const [count, setCount] = useState<boolean>(0); ... })
* don't call hook conditionally
* need a lifecycle in order to actually update the value

* instead of prop drilling (passing props between components) can `createContext()` and all children can access context with `useContext`. Note the code example here references useState and logout functions in the NavBar itself.

``` jsx
export const NavbarContext = createContext();
// Alt is to make a custom hook - this is neat as well.
export const useNavbarContext = () => useContext(NavbarContext);
return (
    <NavbarContext.Provider value={{ user, logout }}>
        <OtherComponents>
    </NavbarContext.Provider>
);
```



## Getting dev server running

`npm run dev`

### Vite ts config and path alias

`npm install --save-dev vite-tsconfig-paths`
Did not work at all that I could see