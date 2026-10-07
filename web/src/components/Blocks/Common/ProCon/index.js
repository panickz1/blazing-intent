import IconComponent from "@/helpers/functions/getIcon";

function ProConItem({ item, type }) {
  return (
    <div className="text-sm flex gap-3 text-white/85 leading-6">
      {type === "pro" ? 
        <IconComponent iconName={'check'} className="text-success text-[21px] mt-0.5"  />
        : 
        <IconComponent iconName={'clear'} className="text-destructive text-[21px] mt-0.5"  />
      }
      {item.text}
    </div>
  );
}

export default function ProCon(props) {
  const { pros, cons, proLabel, conLabel } = props;

  return (
    <div className="grid  items-start grid-cols-1 md:grid-cols-2 gap-8 lg:gap-6 self-start mt-4 lg:mt-2 my-3 w-full">
      <div className="relative">
      <div className="mb-2 text-sm left-4 -top-5  px-4 py-1 bg-success rounded-lg border-grey-950 border-4  absolute  font-semibold self-start">{proLabel || "Pros"}</div>
        <div className="bg-grey-800  p-6 lg:p-8 flex !pt-10 flex-col gap-4 rounded-md">
          {pros?.map((item, index) => (
            <ProConItem key={`pro-${index}`} item={item} type="pro" />
          ))}
        </div>
      </div>
      <div className="relative">
      <div className="mb-2 text-sm left-4 -top-5 px-4 py-1 bg-destructive rounded-lg border-grey-950 border-4 absolute  font-semibold self-start">{conLabel || "Cons"}</div>
        <div className="bg-grey-800 p-6 lg:p-8 flex flex-col !pt-10 gap-4   rounded-md">
          {cons?.map((item, index) => (
            <ProConItem key={`con-${index}`} item={item} type="con" />
          ))}
        </div>
      </div>
    </div>
  );
}