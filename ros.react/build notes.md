# ROS react version of Recipe ordering simplified

## Tools used

* React with react router dom
* [Vite](https://mantine.dev/guides/vite/)
* [Mantine](https://mantine.dev/getting-started/) 
* [lucide-react - icons](https://lucide.dev/icons/)

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

## Color choices

* Darker accent - #2a5846
* accent foreground - #128758
* text on accent - #FFFFFF
* background normal - #F7F7F7
* text on normal - #070707
* muted text on normal - #6b6b6b
* Menu background - #FFFFFF
* Alert - #f7bd29 (Stars/favourites)
* burnt orange - #e6600b (some titles?)

## Menu cutout design

ChatGPT was completely useless again to be able to find any answer on how to style a cutout for a background. Used the following medium article to great effect - https://medium.com/better-programming/how-to-make-a-curved-cutout-to-any-element-74dbdc6bab56 took a bit of time to understand positioning and sizing for linear and radial gradients though.

## Gotchas

* Typescript path alias - e.g. "@features/*": ["src/features/*"]
  * Resolution - is to install `vite-tsconfig-paths` and then in vite.config to exactly specify WHICH tsconfig.json to use `plugins: [react(), tsconfigPaths({ loose: true, root: '../../tsconfig.json'})],` - seems to default to tsconfig.app.json (probably)
  * See [Stackoverflow question](https://stackoverflow.com/questions/75770948/vite-tsconfig-paths-resolves-the-paths-correctly-but-vite-cannot-find-the-files)
* environment file must have prefix `VITE_` e.g. `VITE_API_URL` else vite doesn't share it - bit irritating, but okay I guess

##

Architecture for the account pages - create the white card with ROS title
Login page - email/password - alt login (not a member yet - register) and forgot password

* if not registered then pass to register page - name, email, pw
* also need the verify-email, reset-password - these take query params and pass to backend and then actions result
* forgot-password form with email address
