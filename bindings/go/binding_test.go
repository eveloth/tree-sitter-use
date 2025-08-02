package tree_sitter_use_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_use "github.com/tree-sitter/tree-sitter-use/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_use.Language())
	if language == nil {
		t.Errorf("Error loading Use grammar")
	}
}
