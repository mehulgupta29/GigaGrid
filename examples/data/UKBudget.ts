import {GigaProps} from "../../src/components/GigaProps";
import {ColumnFormat, AggregationMethod, ColumnDef} from "../../src/models/ColumnLike";
import {GigaActionType} from "../../src/store/GigaStore";
import {CellContentChangeAction} from "../../src/store/handlers/CellContentChange";
declare var require: any;

let json = require("./UKBudget.json");

const columnDefs: ColumnDef[] = [
    {
        colTag: "WFood",
        title: "Food",
        width: 180,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {
            roundTo: 1
        }
    },
    {
        colTag: "WFuel",
        title: "Fuel",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100}
    },
    {
        colTag: "WCloth",
        title: "Cloth",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100}
    },
    {
        colTag: "WAlc",
        title: "Alc",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100}
    },
    {
        colTag: "WTrans",
        title: "Transportation",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100}
    },
    {
        colTag: "WOther",
        title: "Other",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 2, showAsPercent: true, multiplier: 100},
    },
    {
        colTag: "TotExp",
        title: "Total Expense",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {currency: "EUR"}
    },
    {
        colTag: "Age",
        title: "Age",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 0}
    },
    {
        colTag: "Children",
        title: "Children",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 0}
    },
    {
        colTag: "Income",
        title: "Income",
        width: 120,
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE,
        formatInstruction: {roundTo: 0}
    }
];

const initialSubtotalBys = ["Age", "Children", "Income"];

const props: GigaProps = {
    columnDefs: columnDefs,
    initialSubtotalBys: initialSubtotalBys,
    data: json as any[],
    onCellClick: function (row, columnDef, dispatcher) {
        let action: CellContentChangeAction = {
            type: GigaActionType.CELL_CONTENT_CHANGE,
            column: columnDef,
            row: row,
            newContent: 0
        };
        setTimeout(()=>{
            dispatcher.dispatch(action);
        });
        return true;
    }
};

export default props;
