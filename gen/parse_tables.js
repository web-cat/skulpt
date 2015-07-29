// generated by pgen/main.py
Sk.OpMap = {
"(": Sk.Tokenizer.Tokens.T_LPAR,
")": Sk.Tokenizer.Tokens.T_RPAR,
"[": Sk.Tokenizer.Tokens.T_LSQB,
"]": Sk.Tokenizer.Tokens.T_RSQB,
":": Sk.Tokenizer.Tokens.T_COLON,
",": Sk.Tokenizer.Tokens.T_COMMA,
";": Sk.Tokenizer.Tokens.T_SEMI,
"+": Sk.Tokenizer.Tokens.T_PLUS,
"-": Sk.Tokenizer.Tokens.T_MINUS,
"*": Sk.Tokenizer.Tokens.T_STAR,
"/": Sk.Tokenizer.Tokens.T_SLASH,
"|": Sk.Tokenizer.Tokens.T_VBAR,
"&": Sk.Tokenizer.Tokens.T_AMPER,
"<": Sk.Tokenizer.Tokens.T_LESS,
">": Sk.Tokenizer.Tokens.T_GREATER,
"=": Sk.Tokenizer.Tokens.T_EQUAL,
".": Sk.Tokenizer.Tokens.T_DOT,
"%": Sk.Tokenizer.Tokens.T_PERCENT,
"`": Sk.Tokenizer.Tokens.T_BACKQUOTE,
"{": Sk.Tokenizer.Tokens.T_LBRACE,
"}": Sk.Tokenizer.Tokens.T_RBRACE,
"@": Sk.Tokenizer.Tokens.T_AT,
"==": Sk.Tokenizer.Tokens.T_EQEQUAL,
"!=": Sk.Tokenizer.Tokens.T_NOTEQUAL,
"<>": Sk.Tokenizer.Tokens.T_NOTEQUAL,
"<=": Sk.Tokenizer.Tokens.T_LESSEQUAL,
">=": Sk.Tokenizer.Tokens.T_GREATEREQUAL,
"~": Sk.Tokenizer.Tokens.T_TILDE,
"^": Sk.Tokenizer.Tokens.T_CIRCUMFLEX,
"<<": Sk.Tokenizer.Tokens.T_LEFTSHIFT,
">>": Sk.Tokenizer.Tokens.T_RIGHTSHIFT,
"**": Sk.Tokenizer.Tokens.T_DOUBLESTAR,
"+=": Sk.Tokenizer.Tokens.T_PLUSEQUAL,
"-=": Sk.Tokenizer.Tokens.T_MINEQUAL,
"*=": Sk.Tokenizer.Tokens.T_STAREQUAL,
"/=": Sk.Tokenizer.Tokens.T_SLASHEQUAL,
"%=": Sk.Tokenizer.Tokens.T_PERCENTEQUAL,
"&=": Sk.Tokenizer.Tokens.T_AMPEREQUAL,
"|=": Sk.Tokenizer.Tokens.T_VBAREQUAL,
"^=": Sk.Tokenizer.Tokens.T_CIRCUMFLEXEQUAL,
"<<=": Sk.Tokenizer.Tokens.T_LEFTSHIFTEQUAL,
">>=": Sk.Tokenizer.Tokens.T_RIGHTSHIFTEQUAL,
"**=": Sk.Tokenizer.Tokens.T_DOUBLESTAREQUAL,
"//": Sk.Tokenizer.Tokens.T_DOUBLESLASH,
"//=": Sk.Tokenizer.Tokens.T_DOUBLESLASHEQUAL,
"->": Sk.Tokenizer.Tokens.T_RARROW
};
Sk.ParseTables = {
sym:
{and_expr: 257,
 and_test: 258,
 arglist: 259,
 argument: 260,
 arith_expr: 261,
 assert_stmt: 262,
 atom: 263,
 augassign: 264,
 break_stmt: 265,
 classdef: 266,
 comp_op: 267,
 comparison: 268,
 compound_stmt: 269,
 continue_stmt: 270,
 decorated: 271,
 decorator: 272,
 decorators: 273,
 del_stmt: 274,
 dictmaker: 275,
 dotted_as_name: 276,
 dotted_as_names: 277,
 dotted_name: 278,
 encoding_decl: 279,
 eval_input: 280,
 except_clause: 281,
 exec_stmt: 282,
 expr: 283,
 expr_stmt: 284,
 exprlist: 285,
 factor: 286,
 file_input: 287,
 flow_stmt: 288,
 for_stmt: 289,
 fpdef: 290,
 fplist: 291,
 funcdef: 292,
 gen_for: 293,
 gen_if: 294,
 gen_iter: 295,
 global_stmt: 296,
 if_stmt: 297,
 import_as_name: 298,
 import_as_names: 299,
 import_from: 300,
 import_name: 301,
 import_stmt: 302,
 lambdef: 303,
 list_for: 304,
 list_if: 305,
 list_iter: 306,
 listmaker: 307,
 not_test: 308,
 old_lambdef: 309,
 old_test: 310,
 or_test: 311,
 parameters: 312,
 pass_stmt: 313,
 power: 314,
 raise_stmt: 315,
 return_stmt: 316,
 shift_expr: 317,
 simple_stmt: 318,
 single_input: 256,
 sliceop: 319,
 small_stmt: 320,
 stmt: 321,
 subscript: 322,
 subscriptlist: 323,
 suite: 324,
 term: 325,
 test: 326,
 testlist: 327,
 testlist1: 328,
 testlist_gexp: 329,
 testlist_safe: 330,
 trailer: 331,
 try_stmt: 332,
 varargslist: 333,
 while_stmt: 334,
 with_stmt: 335,
 with_var: 336,
 xor_expr: 337,
 yield_expr: 338,
 yield_stmt: 339},
number2symbol:
{256: 'single_input',
 257: 'and_expr',
 258: 'and_test',
 259: 'arglist',
 260: 'argument',
 261: 'arith_expr',
 262: 'assert_stmt',
 263: 'atom',
 264: 'augassign',
 265: 'break_stmt',
 266: 'classdef',
 267: 'comp_op',
 268: 'comparison',
 269: 'compound_stmt',
 270: 'continue_stmt',
 271: 'decorated',
 272: 'decorator',
 273: 'decorators',
 274: 'del_stmt',
 275: 'dictmaker',
 276: 'dotted_as_name',
 277: 'dotted_as_names',
 278: 'dotted_name',
 279: 'encoding_decl',
 280: 'eval_input',
 281: 'except_clause',
 282: 'exec_stmt',
 283: 'expr',
 284: 'expr_stmt',
 285: 'exprlist',
 286: 'factor',
 287: 'file_input',
 288: 'flow_stmt',
 289: 'for_stmt',
 290: 'fpdef',
 291: 'fplist',
 292: 'funcdef',
 293: 'gen_for',
 294: 'gen_if',
 295: 'gen_iter',
 296: 'global_stmt',
 297: 'if_stmt',
 298: 'import_as_name',
 299: 'import_as_names',
 300: 'import_from',
 301: 'import_name',
 302: 'import_stmt',
 303: 'lambdef',
 304: 'list_for',
 305: 'list_if',
 306: 'list_iter',
 307: 'listmaker',
 308: 'not_test',
 309: 'old_lambdef',
 310: 'old_test',
 311: 'or_test',
 312: 'parameters',
 313: 'pass_stmt',
 314: 'power',
 315: 'raise_stmt',
 316: 'return_stmt',
 317: 'shift_expr',
 318: 'simple_stmt',
 319: 'sliceop',
 320: 'small_stmt',
 321: 'stmt',
 322: 'subscript',
 323: 'subscriptlist',
 324: 'suite',
 325: 'term',
 326: 'test',
 327: 'testlist',
 328: 'testlist1',
 329: 'testlist_gexp',
 330: 'testlist_safe',
 331: 'trailer',
 332: 'try_stmt',
 333: 'varargslist',
 334: 'while_stmt',
 335: 'with_stmt',
 336: 'with_var',
 337: 'xor_expr',
 338: 'yield_expr',
 339: 'yield_stmt'},
dfas:
{256: [[[[1, 1], [2, 1], [3, 2]], [[0, 1]], [[2, 1]]],
       {2: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1}],
 257: [[[[36, 1]], [[37, 0], [0, 1]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 258: [[[[38, 1]], [[39, 0], [0, 1]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1}],
 259: [[[[40, 1], [41, 2], [42, 3]],
        [[43, 4]],
        [[44, 5], [0, 2]],
        [[43, 6]],
        [[44, 7], [0, 4]],
        [[40, 1], [41, 2], [42, 3], [0, 5]],
        [[0, 6]],
        [[41, 4], [42, 3]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1,
        40: 1,
        42: 1}],
 260: [[[[43, 1]], [[45, 2], [46, 3], [0, 1]], [[0, 2]], [[43, 2]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 261: [[[[47, 1]], [[23, 0], [34, 0], [0, 1]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 262: [[[[18, 1]], [[43, 2]], [[44, 3], [0, 2]], [[43, 4]], [[0, 4]]],
       {18: 1}],
 263: [[[[19, 1], [8, 1], [9, 4], [27, 3], [11, 2], [12, 5], [16, 6]],
        [[0, 1]],
        [[48, 7], [49, 1]],
        [[50, 1], [51, 8], [52, 8]],
        [[53, 9], [54, 1]],
        [[55, 10]],
        [[16, 6], [0, 6]],
        [[49, 1]],
        [[50, 1]],
        [[54, 1]],
        [[12, 1]]],
       {8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 27: 1}],
 264: [[[[56, 1],
         [57, 1],
         [58, 1],
         [59, 1],
         [60, 1],
         [61, 1],
         [62, 1],
         [63, 1],
         [64, 1],
         [65, 1],
         [66, 1],
         [67, 1]],
        [[0, 1]]],
       {56: 1,
        57: 1,
        58: 1,
        59: 1,
        60: 1,
        61: 1,
        62: 1,
        63: 1,
        64: 1,
        65: 1,
        66: 1,
        67: 1}],
 265: [[[[30, 1]], [[0, 1]]], {30: 1}],
 266: [[[[10, 1]],
        [[19, 2]],
        [[68, 3], [27, 4]],
        [[69, 5]],
        [[50, 6], [70, 7]],
        [[0, 5]],
        [[68, 3]],
        [[50, 6]]],
       {10: 1}],
 267: [[[[71, 1],
         [72, 1],
         [7, 2],
         [73, 1],
         [71, 1],
         [74, 1],
         [75, 1],
         [76, 3],
         [77, 1],
         [78, 1]],
        [[0, 1]],
        [[74, 1]],
        [[7, 1], [0, 3]]],
       {7: 1, 71: 1, 72: 1, 73: 1, 74: 1, 75: 1, 76: 1, 77: 1, 78: 1}],
 268: [[[[79, 1]], [[80, 0], [0, 1]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 269: [[[[81, 1],
         [82, 1],
         [83, 1],
         [84, 1],
         [85, 1],
         [86, 1],
         [87, 1],
         [88, 1]],
        [[0, 1]]],
       {4: 1, 10: 1, 13: 1, 15: 1, 26: 1, 29: 1, 32: 1, 33: 1}],
 270: [[[[31, 1]], [[0, 1]]], {31: 1}],
 271: [[[[89, 1]], [[87, 2], [84, 2]], [[0, 2]]], {32: 1}],
 272: [[[[32, 1]],
        [[90, 2]],
        [[2, 4], [27, 3]],
        [[50, 5], [91, 6]],
        [[0, 4]],
        [[2, 4]],
        [[50, 5]]],
       {32: 1}],
 273: [[[[92, 1]], [[92, 1], [0, 1]]], {32: 1}],
 274: [[[[20, 1]], [[93, 2]], [[0, 2]]], {20: 1}],
 275: [[[[43, 1]],
        [[68, 2]],
        [[43, 3]],
        [[44, 4], [0, 3]],
        [[43, 1], [0, 4]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 276: [[[[90, 1]], [[94, 2], [0, 1]], [[19, 3]], [[0, 3]]], {19: 1}],
 277: [[[[95, 1]], [[44, 0], [0, 1]]], {19: 1}],
 278: [[[[19, 1]], [[96, 0], [0, 1]]], {19: 1}],
 279: [[[[19, 1]], [[0, 1]]], {19: 1}],
 280: [[[[70, 1]], [[2, 1], [97, 2]], [[0, 2]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 281: [[[[98, 1]],
        [[43, 2], [0, 1]],
        [[94, 3], [44, 3], [0, 2]],
        [[43, 4]],
        [[0, 4]]],
       {98: 1}],
 282: [[[[14, 1]],
        [[79, 2]],
        [[74, 3], [0, 2]],
        [[43, 4]],
        [[44, 5], [0, 4]],
        [[43, 6]],
        [[0, 6]]],
       {14: 1}],
 283: [[[[99, 1]], [[100, 0], [0, 1]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 284: [[[[70, 1]],
        [[101, 2], [46, 3], [0, 1]],
        [[70, 4], [52, 4]],
        [[70, 5], [52, 5]],
        [[0, 4]],
        [[46, 3], [0, 5]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 285: [[[[79, 1]], [[44, 2], [0, 1]], [[79, 1], [0, 2]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 286: [[[[102, 2], [23, 1], [6, 1], [34, 1]], [[103, 2]], [[0, 2]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 287: [[[[2, 0], [97, 1], [104, 0]], [[0, 1]]],
       {2: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1,
        97: 1}],
 288: [[[[105, 1], [106, 1], [107, 1], [108, 1], [109, 1]], [[0, 1]]],
       {5: 1, 17: 1, 24: 1, 30: 1, 31: 1}],
 289: [[[[26, 1]],
        [[93, 2]],
        [[74, 3]],
        [[70, 4]],
        [[68, 5]],
        [[69, 6]],
        [[110, 7], [0, 6]],
        [[68, 8]],
        [[69, 9]],
        [[0, 9]]],
       {26: 1}],
 290: [[[[27, 1], [19, 2]], [[111, 3]], [[0, 2]], [[50, 2]]], {19: 1, 27: 1}],
 291: [[[[112, 1]], [[44, 2], [0, 1]], [[112, 1], [0, 2]]], {19: 1, 27: 1}],
 292: [[[[4, 1]], [[19, 2]], [[113, 3]], [[68, 4]], [[69, 5]], [[0, 5]]],
       {4: 1}],
 293: [[[[26, 1]],
        [[93, 2]],
        [[74, 3]],
        [[114, 4]],
        [[115, 5], [0, 4]],
        [[0, 5]]],
       {26: 1}],
 294: [[[[29, 1]], [[116, 2]], [[115, 3], [0, 2]], [[0, 3]]], {29: 1}],
 295: [[[[45, 1], [117, 1]], [[0, 1]]], {26: 1, 29: 1}],
 296: [[[[25, 1]], [[19, 2]], [[44, 1], [0, 2]]], {25: 1}],
 297: [[[[29, 1]],
        [[43, 2]],
        [[68, 3]],
        [[69, 4]],
        [[110, 5], [118, 1], [0, 4]],
        [[68, 6]],
        [[69, 7]],
        [[0, 7]]],
       {29: 1}],
 298: [[[[19, 1]], [[94, 2], [0, 1]], [[19, 3]], [[0, 3]]], {19: 1}],
 299: [[[[119, 1]], [[44, 2], [0, 1]], [[119, 1], [0, 2]]], {19: 1}],
 300: [[[[28, 1]],
        [[90, 2], [96, 3]],
        [[22, 4]],
        [[90, 2], [22, 4], [96, 3]],
        [[120, 5], [40, 5], [27, 6]],
        [[0, 5]],
        [[120, 7]],
        [[50, 5]]],
       {28: 1}],
 301: [[[[22, 1]], [[121, 2]], [[0, 2]]], {22: 1}],
 302: [[[[122, 1], [123, 1]], [[0, 1]]], {22: 1, 28: 1}],
 303: [[[[35, 1]], [[68, 2], [124, 3]], [[43, 4]], [[68, 2]], [[0, 4]]],
       {35: 1}],
 304: [[[[26, 1]],
        [[93, 2]],
        [[74, 3]],
        [[125, 4]],
        [[126, 5], [0, 4]],
        [[0, 5]]],
       {26: 1}],
 305: [[[[29, 1]], [[116, 2]], [[126, 3], [0, 2]], [[0, 3]]], {29: 1}],
 306: [[[[127, 1], [128, 1]], [[0, 1]]], {26: 1, 29: 1}],
 307: [[[[43, 1]],
        [[127, 2], [44, 3], [0, 1]],
        [[0, 2]],
        [[43, 4], [0, 3]],
        [[44, 3], [0, 4]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 308: [[[[7, 1], [129, 2]], [[38, 2]], [[0, 2]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1}],
 309: [[[[35, 1]], [[68, 2], [124, 3]], [[116, 4]], [[68, 2]], [[0, 4]]],
       {35: 1}],
 310: [[[[130, 1], [114, 1]], [[0, 1]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 311: [[[[131, 1]], [[132, 0], [0, 1]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1}],
 312: [[[[27, 1]], [[50, 2], [124, 3]], [[0, 2]], [[50, 2]]], {27: 1}],
 313: [[[[21, 1]], [[0, 1]]], {21: 1}],
 314: [[[[133, 1]], [[134, 1], [42, 2], [0, 1]], [[103, 3]], [[0, 3]]],
       {8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 27: 1}],
 315: [[[[5, 1]],
        [[43, 2], [0, 1]],
        [[44, 3], [0, 2]],
        [[43, 4]],
        [[44, 5], [0, 4]],
        [[43, 6]],
        [[0, 6]]],
       {5: 1}],
 316: [[[[17, 1]], [[70, 2], [0, 1]], [[0, 2]]], {17: 1}],
 317: [[[[135, 1]], [[136, 0], [137, 0], [0, 1]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 318: [[[[138, 1]], [[2, 2], [139, 3]], [[0, 2]], [[138, 1], [2, 2]]],
       {5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        14: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        27: 1,
        28: 1,
        30: 1,
        31: 1,
        34: 1,
        35: 1}],
 319: [[[[68, 1]], [[43, 2], [0, 1]], [[0, 2]]], {68: 1}],
 320: [[[[140, 1],
         [141, 1],
         [142, 1],
         [143, 1],
         [144, 1],
         [145, 1],
         [146, 1],
         [147, 1]],
        [[0, 1]]],
       {5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        14: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        27: 1,
        28: 1,
        30: 1,
        31: 1,
        34: 1,
        35: 1}],
 321: [[[[1, 1], [3, 1]], [[0, 1]]],
       {4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1}],
 322: [[[[43, 1], [68, 2], [96, 3]],
        [[68, 2], [0, 1]],
        [[43, 4], [148, 5], [0, 2]],
        [[96, 6]],
        [[148, 5], [0, 4]],
        [[0, 5]],
        [[96, 5]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1,
        68: 1,
        96: 1}],
 323: [[[[149, 1]], [[44, 2], [0, 1]], [[149, 1], [0, 2]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1,
        68: 1,
        96: 1}],
 324: [[[[1, 1], [2, 2]],
        [[0, 1]],
        [[150, 3]],
        [[104, 4]],
        [[151, 1], [104, 4]]],
       {2: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        14: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        27: 1,
        28: 1,
        30: 1,
        31: 1,
        34: 1,
        35: 1}],
 325: [[[[103, 1]], [[152, 0], [40, 0], [153, 0], [154, 0], [0, 1]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 326: [[[[114, 1], [155, 2]],
        [[29, 3], [0, 1]],
        [[0, 2]],
        [[114, 4]],
        [[110, 5]],
        [[43, 2]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 327: [[[[43, 1]], [[44, 2], [0, 1]], [[43, 1], [0, 2]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 328: [[[[43, 1]], [[44, 0], [0, 1]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 329: [[[[43, 1]],
        [[45, 2], [44, 3], [0, 1]],
        [[0, 2]],
        [[43, 4], [0, 3]],
        [[44, 3], [0, 4]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 330: [[[[116, 1]],
        [[44, 2], [0, 1]],
        [[116, 3]],
        [[44, 4], [0, 3]],
        [[116, 3], [0, 4]]],
       {6: 1,
        7: 1,
        8: 1,
        9: 1,
        11: 1,
        12: 1,
        16: 1,
        19: 1,
        23: 1,
        27: 1,
        34: 1,
        35: 1}],
 331: [[[[27, 1], [96, 2], [11, 3]],
        [[50, 4], [91, 5]],
        [[19, 4]],
        [[156, 6]],
        [[0, 4]],
        [[50, 4]],
        [[49, 4]]],
       {11: 1, 27: 1, 96: 1}],
 332: [[[[13, 1]],
        [[68, 2]],
        [[69, 3]],
        [[157, 4], [158, 5]],
        [[68, 6]],
        [[68, 7]],
        [[69, 8]],
        [[69, 9]],
        [[157, 4], [110, 10], [158, 5], [0, 8]],
        [[0, 9]],
        [[68, 11]],
        [[69, 12]],
        [[158, 5], [0, 12]]],
       {13: 1}],
 333: [[[[40, 1], [112, 2], [42, 3]],
        [[19, 4]],
        [[46, 5], [44, 6], [0, 2]],
        [[19, 7]],
        [[44, 8], [0, 4]],
        [[43, 9]],
        [[40, 1], [112, 2], [42, 3], [0, 6]],
        [[0, 7]],
        [[42, 3]],
        [[44, 6], [0, 9]]],
       {19: 1, 27: 1, 40: 1, 42: 1}],
 334: [[[[15, 1]],
        [[43, 2]],
        [[68, 3]],
        [[69, 4]],
        [[110, 5], [0, 4]],
        [[68, 6]],
        [[69, 7]],
        [[0, 7]]],
       {15: 1}],
 335: [[[[33, 1]],
        [[43, 2]],
        [[68, 3], [159, 4]],
        [[69, 5]],
        [[68, 3]],
        [[0, 5]]],
       {33: 1}],
 336: [[[[94, 1]], [[79, 2]], [[0, 2]]], {94: 1}],
 337: [[[[160, 1]], [[161, 0], [0, 1]]],
       {6: 1, 8: 1, 9: 1, 11: 1, 12: 1, 16: 1, 19: 1, 23: 1, 27: 1, 34: 1}],
 338: [[[[24, 1]], [[70, 2], [0, 1]], [[0, 2]]], {24: 1}],
 339: [[[[52, 1]], [[0, 1]]], {24: 1}]},
states:
[[[[1, 1], [2, 1], [3, 2]], [[0, 1]], [[2, 1]]],
 [[[36, 1]], [[37, 0], [0, 1]]],
 [[[38, 1]], [[39, 0], [0, 1]]],
 [[[40, 1], [41, 2], [42, 3]],
  [[43, 4]],
  [[44, 5], [0, 2]],
  [[43, 6]],
  [[44, 7], [0, 4]],
  [[40, 1], [41, 2], [42, 3], [0, 5]],
  [[0, 6]],
  [[41, 4], [42, 3]]],
 [[[43, 1]], [[45, 2], [46, 3], [0, 1]], [[0, 2]], [[43, 2]]],
 [[[47, 1]], [[23, 0], [34, 0], [0, 1]]],
 [[[18, 1]], [[43, 2]], [[44, 3], [0, 2]], [[43, 4]], [[0, 4]]],
 [[[19, 1], [8, 1], [9, 4], [27, 3], [11, 2], [12, 5], [16, 6]],
  [[0, 1]],
  [[48, 7], [49, 1]],
  [[50, 1], [51, 8], [52, 8]],
  [[53, 9], [54, 1]],
  [[55, 10]],
  [[16, 6], [0, 6]],
  [[49, 1]],
  [[50, 1]],
  [[54, 1]],
  [[12, 1]]],
 [[[56, 1],
   [57, 1],
   [58, 1],
   [59, 1],
   [60, 1],
   [61, 1],
   [62, 1],
   [63, 1],
   [64, 1],
   [65, 1],
   [66, 1],
   [67, 1]],
  [[0, 1]]],
 [[[30, 1]], [[0, 1]]],
 [[[10, 1]],
  [[19, 2]],
  [[68, 3], [27, 4]],
  [[69, 5]],
  [[50, 6], [70, 7]],
  [[0, 5]],
  [[68, 3]],
  [[50, 6]]],
 [[[71, 1],
   [72, 1],
   [7, 2],
   [73, 1],
   [71, 1],
   [74, 1],
   [75, 1],
   [76, 3],
   [77, 1],
   [78, 1]],
  [[0, 1]],
  [[74, 1]],
  [[7, 1], [0, 3]]],
 [[[79, 1]], [[80, 0], [0, 1]]],
 [[[81, 1], [82, 1], [83, 1], [84, 1], [85, 1], [86, 1], [87, 1], [88, 1]],
  [[0, 1]]],
 [[[31, 1]], [[0, 1]]],
 [[[89, 1]], [[87, 2], [84, 2]], [[0, 2]]],
 [[[32, 1]],
  [[90, 2]],
  [[2, 4], [27, 3]],
  [[50, 5], [91, 6]],
  [[0, 4]],
  [[2, 4]],
  [[50, 5]]],
 [[[92, 1]], [[92, 1], [0, 1]]],
 [[[20, 1]], [[93, 2]], [[0, 2]]],
 [[[43, 1]], [[68, 2]], [[43, 3]], [[44, 4], [0, 3]], [[43, 1], [0, 4]]],
 [[[90, 1]], [[94, 2], [0, 1]], [[19, 3]], [[0, 3]]],
 [[[95, 1]], [[44, 0], [0, 1]]],
 [[[19, 1]], [[96, 0], [0, 1]]],
 [[[19, 1]], [[0, 1]]],
 [[[70, 1]], [[2, 1], [97, 2]], [[0, 2]]],
 [[[98, 1]],
  [[43, 2], [0, 1]],
  [[94, 3], [44, 3], [0, 2]],
  [[43, 4]],
  [[0, 4]]],
 [[[14, 1]],
  [[79, 2]],
  [[74, 3], [0, 2]],
  [[43, 4]],
  [[44, 5], [0, 4]],
  [[43, 6]],
  [[0, 6]]],
 [[[99, 1]], [[100, 0], [0, 1]]],
 [[[70, 1]],
  [[101, 2], [46, 3], [0, 1]],
  [[70, 4], [52, 4]],
  [[70, 5], [52, 5]],
  [[0, 4]],
  [[46, 3], [0, 5]]],
 [[[79, 1]], [[44, 2], [0, 1]], [[79, 1], [0, 2]]],
 [[[102, 2], [23, 1], [6, 1], [34, 1]], [[103, 2]], [[0, 2]]],
 [[[2, 0], [97, 1], [104, 0]], [[0, 1]]],
 [[[105, 1], [106, 1], [107, 1], [108, 1], [109, 1]], [[0, 1]]],
 [[[26, 1]],
  [[93, 2]],
  [[74, 3]],
  [[70, 4]],
  [[68, 5]],
  [[69, 6]],
  [[110, 7], [0, 6]],
  [[68, 8]],
  [[69, 9]],
  [[0, 9]]],
 [[[27, 1], [19, 2]], [[111, 3]], [[0, 2]], [[50, 2]]],
 [[[112, 1]], [[44, 2], [0, 1]], [[112, 1], [0, 2]]],
 [[[4, 1]], [[19, 2]], [[113, 3]], [[68, 4]], [[69, 5]], [[0, 5]]],
 [[[26, 1]], [[93, 2]], [[74, 3]], [[114, 4]], [[115, 5], [0, 4]], [[0, 5]]],
 [[[29, 1]], [[116, 2]], [[115, 3], [0, 2]], [[0, 3]]],
 [[[45, 1], [117, 1]], [[0, 1]]],
 [[[25, 1]], [[19, 2]], [[44, 1], [0, 2]]],
 [[[29, 1]],
  [[43, 2]],
  [[68, 3]],
  [[69, 4]],
  [[110, 5], [118, 1], [0, 4]],
  [[68, 6]],
  [[69, 7]],
  [[0, 7]]],
 [[[19, 1]], [[94, 2], [0, 1]], [[19, 3]], [[0, 3]]],
 [[[119, 1]], [[44, 2], [0, 1]], [[119, 1], [0, 2]]],
 [[[28, 1]],
  [[90, 2], [96, 3]],
  [[22, 4]],
  [[90, 2], [22, 4], [96, 3]],
  [[120, 5], [40, 5], [27, 6]],
  [[0, 5]],
  [[120, 7]],
  [[50, 5]]],
 [[[22, 1]], [[121, 2]], [[0, 2]]],
 [[[122, 1], [123, 1]], [[0, 1]]],
 [[[35, 1]], [[68, 2], [124, 3]], [[43, 4]], [[68, 2]], [[0, 4]]],
 [[[26, 1]], [[93, 2]], [[74, 3]], [[125, 4]], [[126, 5], [0, 4]], [[0, 5]]],
 [[[29, 1]], [[116, 2]], [[126, 3], [0, 2]], [[0, 3]]],
 [[[127, 1], [128, 1]], [[0, 1]]],
 [[[43, 1]],
  [[127, 2], [44, 3], [0, 1]],
  [[0, 2]],
  [[43, 4], [0, 3]],
  [[44, 3], [0, 4]]],
 [[[7, 1], [129, 2]], [[38, 2]], [[0, 2]]],
 [[[35, 1]], [[68, 2], [124, 3]], [[116, 4]], [[68, 2]], [[0, 4]]],
 [[[130, 1], [114, 1]], [[0, 1]]],
 [[[131, 1]], [[132, 0], [0, 1]]],
 [[[27, 1]], [[50, 2], [124, 3]], [[0, 2]], [[50, 2]]],
 [[[21, 1]], [[0, 1]]],
 [[[133, 1]], [[134, 1], [42, 2], [0, 1]], [[103, 3]], [[0, 3]]],
 [[[5, 1]],
  [[43, 2], [0, 1]],
  [[44, 3], [0, 2]],
  [[43, 4]],
  [[44, 5], [0, 4]],
  [[43, 6]],
  [[0, 6]]],
 [[[17, 1]], [[70, 2], [0, 1]], [[0, 2]]],
 [[[135, 1]], [[136, 0], [137, 0], [0, 1]]],
 [[[138, 1]], [[2, 2], [139, 3]], [[0, 2]], [[138, 1], [2, 2]]],
 [[[68, 1]], [[43, 2], [0, 1]], [[0, 2]]],
 [[[140, 1],
   [141, 1],
   [142, 1],
   [143, 1],
   [144, 1],
   [145, 1],
   [146, 1],
   [147, 1]],
  [[0, 1]]],
 [[[1, 1], [3, 1]], [[0, 1]]],
 [[[43, 1], [68, 2], [96, 3]],
  [[68, 2], [0, 1]],
  [[43, 4], [148, 5], [0, 2]],
  [[96, 6]],
  [[148, 5], [0, 4]],
  [[0, 5]],
  [[96, 5]]],
 [[[149, 1]], [[44, 2], [0, 1]], [[149, 1], [0, 2]]],
 [[[1, 1], [2, 2]], [[0, 1]], [[150, 3]], [[104, 4]], [[151, 1], [104, 4]]],
 [[[103, 1]], [[152, 0], [40, 0], [153, 0], [154, 0], [0, 1]]],
 [[[114, 1], [155, 2]],
  [[29, 3], [0, 1]],
  [[0, 2]],
  [[114, 4]],
  [[110, 5]],
  [[43, 2]]],
 [[[43, 1]], [[44, 2], [0, 1]], [[43, 1], [0, 2]]],
 [[[43, 1]], [[44, 0], [0, 1]]],
 [[[43, 1]],
  [[45, 2], [44, 3], [0, 1]],
  [[0, 2]],
  [[43, 4], [0, 3]],
  [[44, 3], [0, 4]]],
 [[[116, 1]],
  [[44, 2], [0, 1]],
  [[116, 3]],
  [[44, 4], [0, 3]],
  [[116, 3], [0, 4]]],
 [[[27, 1], [96, 2], [11, 3]],
  [[50, 4], [91, 5]],
  [[19, 4]],
  [[156, 6]],
  [[0, 4]],
  [[50, 4]],
  [[49, 4]]],
 [[[13, 1]],
  [[68, 2]],
  [[69, 3]],
  [[157, 4], [158, 5]],
  [[68, 6]],
  [[68, 7]],
  [[69, 8]],
  [[69, 9]],
  [[157, 4], [110, 10], [158, 5], [0, 8]],
  [[0, 9]],
  [[68, 11]],
  [[69, 12]],
  [[158, 5], [0, 12]]],
 [[[40, 1], [112, 2], [42, 3]],
  [[19, 4]],
  [[46, 5], [44, 6], [0, 2]],
  [[19, 7]],
  [[44, 8], [0, 4]],
  [[43, 9]],
  [[40, 1], [112, 2], [42, 3], [0, 6]],
  [[0, 7]],
  [[42, 3]],
  [[44, 6], [0, 9]]],
 [[[15, 1]],
  [[43, 2]],
  [[68, 3]],
  [[69, 4]],
  [[110, 5], [0, 4]],
  [[68, 6]],
  [[69, 7]],
  [[0, 7]]],
 [[[33, 1]], [[43, 2]], [[68, 3], [159, 4]], [[69, 5]], [[68, 3]], [[0, 5]]],
 [[[94, 1]], [[79, 2]], [[0, 2]]],
 [[[160, 1]], [[161, 0], [0, 1]]],
 [[[24, 1]], [[70, 2], [0, 1]], [[0, 2]]],
 [[[52, 1]], [[0, 1]]]],
labels:
[[0, 'EMPTY'],
 [318, null],
 [4, null],
 [269, null],
 [1, 'def'],
 [1, 'raise'],
 [32, null],
 [1, 'not'],
 [2, null],
 [26, null],
 [1, 'class'],
 [9, null],
 [25, null],
 [1, 'try'],
 [1, 'exec'],
 [1, 'while'],
 [3, null],
 [1, 'return'],
 [1, 'assert'],
 [1, null],
 [1, 'del'],
 [1, 'pass'],
 [1, 'import'],
 [15, null],
 [1, 'yield'],
 [1, 'global'],
 [1, 'for'],
 [7, null],
 [1, 'from'],
 [1, 'if'],
 [1, 'break'],
 [1, 'continue'],
 [50, null],
 [1, 'with'],
 [14, null],
 [1, 'lambda'],
 [317, null],
 [19, null],
 [308, null],
 [1, 'and'],
 [16, null],
 [260, null],
 [36, null],
 [326, null],
 [12, null],
 [293, null],
 [22, null],
 [325, null],
 [307, null],
 [10, null],
 [8, null],
 [329, null],
 [338, null],
 [275, null],
 [27, null],
 [328, null],
 [46, null],
 [39, null],
 [41, null],
 [47, null],
 [42, null],
 [43, null],
 [37, null],
 [44, null],
 [49, null],
 [40, null],
 [38, null],
 [45, null],
 [11, null],
 [324, null],
 [327, null],
 [29, null],
 [21, null],
 [28, null],
 [1, 'in'],
 [30, null],
 [1, 'is'],
 [31, null],
 [20, null],
 [283, null],
 [267, null],
 [332, null],
 [297, null],
 [289, null],
 [266, null],
 [335, null],
 [334, null],
 [292, null],
 [271, null],
 [273, null],
 [278, null],
 [259, null],
 [272, null],
 [285, null],
 [1, 'as'],
 [276, null],
 [23, null],
 [0, null],
 [1, 'except'],
 [337, null],
 [18, null],
 [264, null],
 [314, null],
 [286, null],
 [321, null],
 [265, null],
 [270, null],
 [315, null],
 [316, null],
 [339, null],
 [1, 'else'],
 [291, null],
 [290, null],
 [312, null],
 [311, null],
 [295, null],
 [310, null],
 [294, null],
 [1, 'elif'],
 [298, null],
 [299, null],
 [277, null],
 [301, null],
 [300, null],
 [333, null],
 [330, null],
 [306, null],
 [304, null],
 [305, null],
 [268, null],
 [309, null],
 [258, null],
 [1, 'or'],
 [263, null],
 [331, null],
 [261, null],
 [35, null],
 [34, null],
 [320, null],
 [13, null],
 [288, null],
 [262, null],
 [284, null],
 [313, null],
 [274, null],
 [282, null],
 [296, null],
 [302, null],
 [319, null],
 [322, null],
 [5, null],
 [6, null],
 [48, null],
 [17, null],
 [24, null],
 [303, null],
 [323, null],
 [281, null],
 [1, 'finally'],
 [336, null],
 [257, null],
 [33, null]],
keywords:
{'and': 39,
 'as': 94,
 'assert': 18,
 'break': 30,
 'class': 10,
 'continue': 31,
 'def': 4,
 'del': 20,
 'elif': 118,
 'else': 110,
 'except': 98,
 'exec': 14,
 'finally': 158,
 'for': 26,
 'from': 28,
 'global': 25,
 'if': 29,
 'import': 22,
 'in': 74,
 'is': 76,
 'lambda': 35,
 'not': 7,
 'or': 132,
 'pass': 21,
 'raise': 5,
 'return': 17,
 'try': 13,
 'while': 15,
 'with': 33,
 'yield': 24},
tokens:
{0: 97,
 1: 19,
 2: 8,
 3: 16,
 4: 2,
 5: 150,
 6: 151,
 7: 27,
 8: 50,
 9: 11,
 10: 49,
 11: 68,
 12: 44,
 13: 139,
 14: 34,
 15: 23,
 16: 40,
 17: 153,
 18: 100,
 19: 37,
 20: 78,
 21: 72,
 22: 46,
 23: 96,
 24: 154,
 25: 12,
 26: 9,
 27: 54,
 28: 73,
 29: 71,
 30: 75,
 31: 77,
 32: 6,
 33: 161,
 34: 137,
 35: 136,
 36: 42,
 37: 62,
 38: 66,
 39: 57,
 40: 65,
 41: 58,
 42: 60,
 43: 61,
 44: 63,
 45: 67,
 46: 56,
 47: 59,
 48: 152,
 49: 64,
 50: 32},
start: 256
};
