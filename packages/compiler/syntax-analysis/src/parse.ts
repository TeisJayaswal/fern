import { FernFile, RelativeFilePath } from "@fern/compiler-commons";
import yaml from "js-yaml";
import path from "path";
import { SyntaxAnalysis, SyntaxAnalysisFailureType } from "./types";

export type ParsedFileContents = unknown;

export declare namespace Parser {
    export type Result = SuccessfulResult | FailedResult;

    export interface SuccessfulResult {
        didSucceed: true;
        files: Record<RelativeFilePath, ParsedFileContents>;
    }

    export interface FailedResult {
        didSucceed: false;
        failures: Record<RelativeFilePath, SyntaxAnalysis.FileParseFailure>;
    }
}

export async function parse(files: readonly FernFile[]): Promise<Parser.Result> {
    const parsedFiles: Record<RelativeFilePath, ParsedFileContents> = {};
    const failures: Record<RelativeFilePath, SyntaxAnalysis.FileParseFailure> = {};

    async function parseFilePath(file: FernFile) {
        const parsed = path.parse(file.filepath);
        const filepathWithoutExtension = path.join(parsed.dir, parsed.name);

        try {
            const parsed = yaml.load(file.fileContents);
            parsedFiles[filepathWithoutExtension] = parsed;
        } catch (error) {
            failures[filepathWithoutExtension] = {
                type: SyntaxAnalysisFailureType.FILE_PARSE,
                error,
            };
        }
    }

    await Promise.all(files.map(parseFilePath));
    if (Object.keys(failures).length > 0) {
        return {
            didSucceed: false,
            failures,
        };
    } else {
        return {
            didSucceed: true,
            files: parsedFiles,
        };
    }
}