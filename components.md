## To use components, run the following steps

- Add components branch

```
git checkout main
git remote add components https://github.com/rowend36/react-components.git
git checkout -b components -t components/components
```

- Merge components into main

```
git merge --no-commit --no-ff components --allow-unrelated-histories
git restore --staged .
git checkout components -- .
git merge
```

- Merge main into components

```
git checkout components
git merge --no-commit --no-ff main~1 --allow-unrelated-histories
git restore --staged .
git checkout main~1 -- .
git add -u
```
