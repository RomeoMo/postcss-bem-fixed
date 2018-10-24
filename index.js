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
    ruleSelector = CONFIG.bem[atRule.name] + atRule.params + ruleSelector;
    if (atRule.parent.type === 'root') {
      theSelector = ruleSelector;
      ruleSelector = '';
      return theSelector;
    } else {
      atRule = atRule.parent;
      return getSelector(atRule);
    }
  }

  return (root, result) => {
    root.walkAtRules(atRule => {

      let theDecls = [];
      let getSel = getSelector(atRule);
      let newRule = postcss.rule({
        selector: getSel
      });

      atRules.push(atRule);
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
    });
    atRules.forEach((item) => {
      item.remove();
    });
  }
});
