const mapSelectorList = (ast, callback) => {
  for (let sel = ast.children.head; sel != null; sel = sel.next) {
    let node = sel.data;
    if (node.type !== "Selector") {
      continue;
    }
    for (let ch = node.children.head; ch != null; ch = ch.next) {
      callback(ch.data);
    }
  }
};

const cleanPseudoSelector = (ast, searchStr, replacement) => {
  for (let child = ast.children.head; child != null; child = child.next) {
    mapSelectorList(child.data, (inner) => {
      let s = "";
      inner.name = inner.name.replace(searchStr, replacement);
    });
  }
};

const beforeCompress = (ast, options) => {
  for (let node = ast.children.head; node != null; node = node.next) {
    if (!node.data.prelude || node.data.prelude.type !== "SelectorList") {
      continue;
    }
    mapSelectorList(node.data.prelude, (ast) => {
      // Find all the "where" selectors and remove the "astro-" prefix
      if (ast.type === "PseudoClassSelector" && ast.name === "where") {
        cleanPseudoSelector(ast, "astro-", "");
      }
    });
  }
};

export { beforeCompress };
