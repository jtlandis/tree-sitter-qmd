package tree_sitter_qmd_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-qmd"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_qmd.Language())
	if language == nil {
		t.Errorf("Error loading Qmd grammar")
	}
}
