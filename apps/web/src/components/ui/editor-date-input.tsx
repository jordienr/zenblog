import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Value = {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
};

export function EditorDateInput({
  value,
  onChange,
}: {
  value: Value;
  onChange: (value: Value) => void;
}) {
  return (
    <div className="flex gap-4">
      <div>
        <label className="text-xs text-zinc-500" htmlFor="date">
          Date
        </label>
        <div className="flex gap-1">
          <Input
            type="number"
            name="day"
            placeholder="Day"
            className="w-14 rounded-r-sm"
            min="1"
            max="31"
            value={value.day}
            onChange={(e) => {
              onChange({
                ...value,
                day: parseInt(e.target.value),
              });
            }}
          />
          <Select
            value={value.month.toString()}
            onValueChange={(e) => {
              onChange({
                ...value,
                month: parseInt(e),
              });
            }}
          >
            <SelectTrigger className="w-[120px] rounded-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">January</SelectItem>
              <SelectItem value="1">February</SelectItem>
              <SelectItem value="2">March</SelectItem>
              <SelectItem value="3">April</SelectItem>
              <SelectItem value="4">May</SelectItem>
              <SelectItem value="5">June</SelectItem>
              <SelectItem value="6">July</SelectItem>
              <SelectItem value="7">August</SelectItem>
              <SelectItem value="8">September</SelectItem>
              <SelectItem value="9">October</SelectItem>
              <SelectItem value="10">November</SelectItem>
              <SelectItem value="11">December</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            name="year"
            placeholder="Year"
            className="w-20 rounded-l-sm"
            value={value.year}
            onChange={(e) => {
              onChange({
                ...value,
                year: parseInt(e.target.value),
              });
            }}
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-500" htmlFor="time">
          Time
        </label>
        <div className="flex gap-1">
          <Input
            type="number"
            name="hour"
            placeholder="Hour"
            className="w-14 rounded-r-sm"
            min="0"
            max="23"
            value={value.hour}
            onChange={(e) => {
              onChange({
                ...value,
                hour: parseInt(e.target.value),
              });
            }}
          />
          <Input
            type="number"
            name="minute"
            placeholder="Minute"
            className="w-14 rounded-l-sm"
            min="0"
            max="59"
            value={value.minute}
            onChange={(e) => {
              onChange({
                ...value,
                minute: parseInt(e.target.value),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
