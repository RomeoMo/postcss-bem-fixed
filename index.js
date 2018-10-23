const postcss = require('postcss');

const CONFIG = {
  bem: {
    block: '.',
    element: '__',
    modifier: '_'
  }
}

module.exports = postcss.plugin('postcss-bem', function(opts) {

  opts = opts || {};

  let atRules = [];

  let ruleSelector = '';
  let theSelector = '';

  let getSelector = (atRule) => {
    if (atRule.parent.type === 'root') {
      ruleSelector = CONFIG.bem[atRule.name] + atRule.params + ruleSelector;
      theSelector = ruleSelector;
      ruleSelector = '';
      return theSelector;
    } else {
      ruleSelector = CONFIG.bem[atRule.name] + atRule.params + ruleSelector;
      atRule = atRule.parent;
      return getSelector(atRule);
    }
  }

  return (root, result) => {
    // console.log("Into the File!");
    // console.log(root.toString());
    root.walkAtRules(atRule => {
      let theDecls = [];
      // console.log(rule.parent.type);
      // console.log(rule.parent.name);
      // console.log(rule.name);
      // console.log(rule.params);
      // console.log(ruleSel);
      atRules.push(atRule);
      let getSel = getSelector(atRule);

      let newRule = postcss.rule({
        selector: getSel
      });

      atRule.nodes.forEach((cur, idx) => {
        if (cur.type === 'decl') {
          theDecls[idx] = postcss.decl({
            prop: cur.prop,
            value: cur.value
          })
        }
      });

      newRule.append(theDecls);
      root.append(newRule);

      // root.append(newRule);
      // atRule.walkDecls(decl => {
      //   console.log(decl);
      // });


      // rule.walkDecls((decl,i) => {
      //   console.log(decl.parent.type);
      // })
    });
    atRules.forEach((item) => {
      item.remove();
    });
  }
});
