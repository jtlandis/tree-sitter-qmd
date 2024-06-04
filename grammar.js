module.exports = grammar({
  name: "qmd",

  rules: {
    // TODO
    source_file: ($) =>
      seq(
        // logic for yaml header...
        optional($._yaml),
        alias(prec.right(repeat($._non_section)), $.section),
        repeat($.section),
      ),
    _yaml: ($) => choice(),
    /*
    block: ($) =>
      choice(
        prec(0, $._non_section),
        prec(1, $._section),
        // TODO: other types of parsible blocks
        //
      ),*/
    _non_section: ($) => choice($.text_body, $.bold, $.fenced_code),
    section: ($) => choice($._sec1, $._sec2, $._sec3, $._sec4, $._sec5),
    _sec1: ($) =>
      prec.right(
        seq(
          $.header1,
          optional($.attrs),
          alias(
            repeat(
              choice(
                alias(choice($._sec5, $._sec4, $._sec3, $._sec2), $.section),
                $._non_section,
              ),
            ),
            $.section1_content,
          ),
        ),
      ),
    _sec2: ($) =>
      prec.right(
        seq(
          $.header2,
          optional($.attrs),
          repeat(
            choice(
              alias(choice($._sec5, $._sec4, $._sec3), $.section),
              $._non_section,
            ),
          ),
        ),
      ),
    _sec3: ($) =>
      prec.right(
        seq(
          $.header3,
          optional($.attrs),
          repeat(
            choice(alias(choice($._sec5, $._sec4), $.section), $._non_section),
          ),
        ),
      ),
    _sec4: ($) =>
      prec.right(
        seq(
          $.header4,
          optional($.attrs),
          repeat(choice(alias($._sec5, $.section), $._non_section)),
        ),
      ),
    _sec5: ($) =>
      prec.right(seq($.header5, optional($.attrs), repeat($._non_section))),
    /* _section: ($) =>
     choice(
       $.section1,
       $.section2,
       // To do: $._section2, $._section3, $._section4, $._section5, $._section6
     ), */

    /* section1: ($) =>
     prec.left(
       2,
       seq(
         $.header1,
         optional($.attrs),
         alias(
           prec(2, repeat1(choice($.section2, prec(4, $._non_section)))),
           $.section1_content,
         ),
       ),
     ), */

    header1: ($) => seq("# ", alias($.text, $.header_content)),
    header2: ($) => seq("## ", alias($.text, $.header_content)),
    header3: ($) => seq("### ", alias($.text, $.header_content)),
    header4: ($) => seq("#### ", alias($.text, $.header_content)),
    header5: ($) => seq("##### ", alias($.text, $.header_content)),

    /*section2: ($) =>
      prec.left(
        2,
        seq($.header2, optional($.attrs), optional(repeat($.text_body))),
      ), */

    //attr: ($) => seq("{", seq("#", /[^( ,})]+/), "}"),
    attrs: ($) => seq("{", repeat($._attr_list), "}"),

    _attr_list: ($) => seq($._attr, optional($._delim)),

    _delim: ($) => /[ \t]*,[ \t]*/,

    _attr: ($) => choice($.attr_id, $.attr_class, $.attr_keyval),

    attr_id: ($) => seq("#", $._label),
    attr_class: ($) => seq(".", $._label),
    attr_keyval: ($) => seq($._word, "=", /[^( ,})]+/),

    bold: ($) => seq("**", $.text, "**"),
    fenced_code_delim: ($) => "```",
    fenced_code: ($) =>
      seq(
        $.fenced_code_delim,
        $.fence_lang,
        optional(alias($._code, $.lang_chunk)),
        $.fenced_code_delim,
        optional($.attrs),
      ),
    fence_lang: ($) =>
      alias(choice(alias($._word, $.lang), $._bracket_lang), $.attrs),
    _bracket_lang: ($) =>
      seq(
        "{",
        seq(optional("="), alias($._word, $.lang)),
        optional(
          seq(alias(optional($._word), $.chunk_name), optional($._delim)),
        ),
        optional($._attr_list),
        "}",
      ),

    _label: ($) => prec.right(seq($._word, repeat(choice($._word, $._num)))),
    _word: ($) => /[a-zA-Z\-]+/,
    _whitespace: ($) => /[ \t]+/,
    _num: ($) => /[0-9]+/,
    _symbols: ($) => /[\~\\\=\.\!\^\(\)\+\`\?\*<>"]/,
    _text: ($) => choice($._word, $._whitespace, $._num),
    line: ($) => prec.right(seq(repeat($._text), "\n")),
    text: ($) => prec.right(repeat1($._text)),
    _code: ($) => repeat1(choice($._text, $._symbols)),
    text_body: ($) => prec.left(repeat1(choice($.text, $._symbols))),
  },
  precedences: ($) => [[$._sec1, $._sec2, $._sec3, $._sec4, $._sec5]],
});
