## Guide to Using Config Files

AutoReview allows you to change the default scoring and rating values.

There are 4 config json files that can be update

1. Complexity
2. Naming Convention
3. Ratings
4. Scoring

Any combination of files can be included in the config zip to upload (e.g all if you want all changed, or just 1 if you want only 1 changed)

Every json will have a 'sReference', this value is shown in the report. It should be unique (ideally version controlled) as it allows readers of the report printout outs to know how the report is scored.

The json schema must not be change, if it is the import will fail.

## 1. Complexity

The Complexity is a value set to give higher weights to certain connectors. As certain connectors use more api calls or require higher technical understanding to debug.

_Negative values can be given, in default scopes are given negative values as they help make the flow more organised and easy to debug_

There are 3 levels to the scoring 

** Example
```json
 "type": "OpenApiConnection",
    "inputs": {
        "host": {
        "apiId": "/providers/Microsoft.PowerApps/apis/shared_excelonlinebusiness",
        "connectionName": "shared_excelonlinebusiness_1",
        "operationId": "GetItems"
        },
```
_The information above can be found in your flows definition file. AutoReview has an export definition feature so you can see your flows definition._

1. Action specific

If you have a particular action you want to score e.g Sharepoint get_items, then you need to set the name as 'operationId'&'connectionName' (this is because different connections share same operation e.g bot excel and sharepoint have GetItems opertionId).

In the example you would set the name to 'GetItemsshared_excelonelinebusiness' (the '_1' should be ignored, as this is a reference to a connection reference as the example is in a solution).

_Action specific should be the top of the array, as AutoReview will pick the first found, and if its below a Type it will return the type complexity score instead._


2. Type

All actions fall into a type category. The full list can be found her [Power Automate Schema](https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#)

So in the above example the name would be 'OpenApiConnection'

3. Default

If a Action Specific value or Type cant be found a value of 1 will be given.

---

## 2. Naming Convention

The naming convention has 2 parts, number of lead characters and the type. It enforces camelcase, so it will always go 'typeVariableName'. The default it set to use first letter and that letter is just the first of type e.g

```
"char":1
{ "Type": "string", "Letter": "s" },
```
= sVariableName

```
"char":2
{ "Type": "string", "Letter": "ss" },
```
= ssVariableName

If a variable type is not found then the variable will pass, so if you don't want naming conventions you can leave the data array empty.

---

## 3. Ratings

Ratings are the scoring for the top 4 cards

- Complexity
- Actions 
- Variables
- Exceptions

For Each there isa Amber (Am) score and Red (Re) Score. So:

complexityAm = Amber Complexity score (card turns amber/orange)
complexityRe = Red Complexity score  (card turns red)

---

## 4. Scoring

Scoring is the split for the Overall Rating . Currently the colour grading is set to 0-74 Red, 75-89 Amber, 90+ Green, at present this can not be changed.

There are a few different scoring calculations, which currently cant be changed (the values can be changed, but the calculation formula cant). Each has a description to explain, some examples are

** Basic Score

```json
{
    "Name":"exceptionScope",
    "Score":10,
    "Note":"score added for exception scope"
}
```
If passes exception scope test scores 10 points
```json
    {
      "Name":"varConstant",
      "Score":5,
      "Note":"score added for naming variables with value in all capitals"
    }
```
If all variables with initialized variable name are all capitals then 5 points (e.g. sTIMESTAMP)

** Threshold Score
```json
    {
      "Name":"variables",
      "Score":10,
      "Note":"score given for variables before deductions"
    },
    {
      "Name":"variablesMin",
      "Score":0,
      "Note":"minimum allowed variables before deductions"
    },
    {
      "Name":"variablesDeduction",
      "Score":1,
      "Note":"score added for exception scope"
    }
```
For every variable above 0 deduct 1 point from 10 (will not go below 0)

** Ratings Score
```json
 {
    "Name":"complexityRed",
    "Score":0,
    "Note":"score added for red scoring complexity"
},
{
    "Name":"complexityAmber",
    "Score":15,
    "Note":"score added for amber scoring complexity"
},
{
    "Name":"complexityGreen",
    "Score":20,
    "Note":"score added green scoring complexity"
}
```


These are directly linked to the rating, so if complexity card was red 0 points, Amber 15 points, Green 20 points

_There currently isn't a 100% validation so you can over score over 100 if you config it to do so_



