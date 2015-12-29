import * as React from 'react';
import * as Flux from 'flux';
import * as FluxUtils from 'flux/utils';
import ReactElement = __React.ReactElement;
import {DetailTableRow,SubtotalTableRow} from "./TableRow";
import {SubtotalBy} from "../models/ColumnLike";
import {ColumnDef} from "../models/ColumnLike";
import {ColumnFormat} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {TableRowColumnDef} from "../models/ColumnLike";
import {SubtotalRow} from "../models/Row";
import {DetailRow} from "../models/Row";
import {TableHeader} from "./TableHeader";
import {TreeRasterizer} from "../static/TreeRasterizer";
import {Tree} from "../static/TreeBuilder";
import {GigaGridStore} from "../store/GigaGridStore";
import ReduceStore = FluxUtils.ReduceStore;
import Dispatcher = Flux.Dispatcher;
import {GigaGridAction} from "../store/GigaGridStore";

export interface GigaGridProps extends React.Props<GigaGrid> {
    initialSubtotalBys?:SubtotalBy[];
    data:any[];
    columnDefs:ColumnDef[];
}

export interface GigaGridState {
    tree:Tree;
    subtotalBys:SubtotalBy[];
}

/**
 * The root component of this React library. assembles raw data into `Row` objects which are then translated into their
 * virtual DOM representation
 *
 * The bulk of the table state is stored in `tree`, which contains subtotal and detail rows
 * Rows can be hidden if filtered out or sorted among other things, subtotal rows can be collapsed etc
 * mutations to the state of table from user initiated actions can be thought of as mutates on the `tree`
 *
 * IMPORTANT: GigaGrid the component does not actually mutate its own state nor give its children the ability
 * to mutate its state. State mutation is managed entirely by the GigaGridStore flux Store. Events generated by the
 * children of this component are emitted to a central dispatcher and are dispatched to the GigaGridStore
 *
 * Please DO NOT pass a reference of this component to its children nor call setState() in the component
 */

export class GigaGrid extends React.Component<GigaGridProps, GigaGridState> {

    private store:GigaGridStore;
    private dispatcher:Dispatcher<GigaGridAction>;

    constructor(props:GigaGridProps) {
        super(props);
        this.dispatcher = new Dispatcher<GigaGridAction>();
        this.store = new GigaGridStore(this.dispatcher, props);
        this.state = this.store.getState();
        this.store.addListener(()=> {
            this.setState(this.store.getState());
        });
    }

    render() {
        const tableRowColumnDefs:TableRowColumnDef[] = this.props.columnDefs.map(cd => {
            return {
                colTag: cd.colTag,
                title: cd.title,
                aggregationMethod: cd.aggregationMethod,
                format: cd.format,
                width: "auto"
            };
        });

        return (
            <div className="giga-grid">
                <table>
                    {this.renderColumnHeaders(tableRowColumnDefs)}
                    <tbody>
                        {this.renderTableRows(tableRowColumnDefs)}
                    </tbody>
                </table>
            </div>);
    }

    renderColumnHeaders(tableRowColumnDefs:TableRowColumnDef[]):ReactElement<{}> {
        const ths = tableRowColumnDefs.map((colDef:TableRowColumnDef, i:number)=> {
            return <TableHeader tableColumnDef={colDef} key={i} isFirstColumn={i===0}
                                isLastColumn={i===tableRowColumnDefs.length-1} dispatcher={this.dispatcher}/>
        });
        return (
            <thead>
                <tr>{ths}</tr>
            </thead>
        );
    }

    renderTableRows(tableRowColumnDefs:TableRowColumnDef[]):ReactElement<{}>[] {
        // TODO consider whether this should be part of GigaGridStore somehow ... we don't want to always re-rasterize
        const rows:Row[] = TreeRasterizer.rasterize(this.state.tree);
        // convert plain ColumnDef to TableRowColumnDef which has additional properties
        return rows.map((row:Row, i:number)=> {
            if (row.isDetail())
                return <DetailTableRow key={i} tableRowColumnDefs={tableRowColumnDefs} row={row as DetailRow}
                                       dispatcher={this.dispatcher}/>;
            else
                return <SubtotalTableRow key={i} tableRowColumnDefs={tableRowColumnDefs} row={row as SubtotalRow}
                                         dispatcher={this.dispatcher}/>
        });
    }
}
