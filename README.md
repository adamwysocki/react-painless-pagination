# react-painless-pagination

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

I wanted to see if I could create a drop in pagination component that "just worked" with minimal config. Goals are:

* SEO friendly (rel=prev, rel=next, etc)
* Smart enough to use window.location to determine current page if none is specified.
* Works even if total number of pages param isn't available.
* If react router is present, use it.
* Follows urls if no callback is specified.
* Common styles (bootstrap, foundation, material, et al) built in.
* small and fast.

This is WIP. Hope to have it done this weekend. Stay tuned!

## License

MIT
