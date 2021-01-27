import { FC } from "react";
import { RenderQueryProvider, useRenderQuery } from "./context";
import * as Util from "./util";

const RenderQuery: TRenderQuery = (props) => {
  return (
    <RenderQueryProvider queries={props.queries}>
      <>{props.children}</>
    </RenderQueryProvider>
  );
};

const Success: FC = (props) => {
  const renderQuery = useRenderQuery();
  if (!renderQuery.success) return null;

  return <>{props.children}</>;
};

const Fallback: FC = (props) => {
  const renderQuery = useRenderQuery();
  if (renderQuery.success) return null;

  return <>{props.children}</>;
};

const Loading: FC = (props) => {
  const renderQuery = useRenderQuery();
  if (!renderQuery.loading.is) return null;

  if (props.children == null) return <div>Loading</div>;

  if (Util.isFunction(props.children)) {
    const loadingQueries = renderQuery.loading.which;
    return (props.children as Function)({ loadingQueries }); // TODO: better typing of function as child
  }

  return <>{props.children}</>;
};

const Err: FC = (props) => {
  const renderQuery = useRenderQuery();
  if (!renderQuery.error.is) return null;

  const errorEntries = Object.entries(renderQuery.error.errors!);

  if (props.children == null)
    return (
      <>
        <h4>Errors:</h4>
        {errorEntries.map(([queryName, value]) => (
          <p>
            <b>[Error][{queryName}] </b>
            {value.message}
          </p>
        ))}
      </>
    );

  if (Util.isFunction(props.children)) {
    return (props.children as Function)({ errors: errorEntries }); // TODO: better typing of function as child
  }

  return <>{props.children}</>;
};

RenderQuery.Loading = Loading;
RenderQuery.Success = Success;
RenderQuery.Fallback = Fallback;
RenderQuery.Error = Err;

export default RenderQuery;

declare interface TRenderQuery extends FC<RenderQueryProps> {
  Loading: typeof Loading;
  Success: typeof Success;
  Fallback: typeof Fallback;
  Error: typeof Err;
}
