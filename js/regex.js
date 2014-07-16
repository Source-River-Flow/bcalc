/** Note from Steven
 *  This file is currently used to test regular expression and string modification.  This is in part to get me familiar with
 *  JavaScript's RegEx and String manipulation.  Feel free to make use of this file.
 */
 
/** Regular Expression
 *
 */
 
// Create a new RegEx instance
myRegEx = /regex/

// Don't use a literal string w/ the constructor since backslashes must be escaped
// Create a new RegEx from a string
myRegEx = new RegExp(aRegExString);
// Create a new RegEx from a string w/ parameters
myRegEx = new RegExp(aRegExString, "gims");

// To replace matched text in aString w/ 'replacement_text'
aString.replace(myRegEx, "replacement_text");

// To retrieve the part of the string matched
myMatch.myRegEx.exec("match_me");    // returns array
// 0th item holds the string matched
// [1..n] items holds text captured by "capturing parentheses"
// if myMatch == null then no match
// myMatch.length == the length of the string matched
// myMatch.index == character position in string "match_me"
// myMatch.input == "match_me"

/** String Manipulation
 *
 */