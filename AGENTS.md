<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project conventions

- Plain-CSS surfaces (modals, login backdrop) read their colours from the
  `--na-um-*` custom properties in `src/theme/global.css`, never from hardcoded
  hex values in components. `AntdProvider` mirrors the active theme onto
  `<html data-na-theme="dark|light">` so those properties can switch with the
  Ant Design theme — keep that marker in place when theming changes.
