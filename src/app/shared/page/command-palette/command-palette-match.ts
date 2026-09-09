import { COMMAND_PALETTE_ENTRIES, CommandPaletteEntry } from './command-palette-entries';

function tokenize ( query: string ): string[] {
  return query.trim().toLowerCase().split( /\s+/ )
    .map( word => word.replace( /^[^a-z0-9]+|[^a-z0-9]+$/g, '' ) )
    .filter( Boolean );
}

function isSubsequence ( needle: string, haystack: string ): boolean {
  let i = 0;
  for ( let j = 0; j < haystack.length && i < needle.length; j++ ) {
    if ( haystack[j] === needle[i] ) i++;
  }
  return i === needle.length;
}

function wordScoreAgainst ( word: string, haystacks: string[] ): number {
  let best = 0;
  for ( const haystack of haystacks ) {
    if ( haystack === word ) best = Math.max( best, 100 );
    else if ( haystack.startsWith( word ) ) best = Math.max( best, 80 );
    else if ( haystack.includes( word ) ) best = Math.max( best, 60 );
    else if ( word.length >= 3 && !haystack.includes( ' ' ) && isSubsequence( word, haystack ) ) best = Math.max( best, 15 );
  }
  return best;
}

function haystacksFor ( entry: CommandPaletteEntry ): string[] {
  return [entry.label, entry.group, ...entry.keywords].map( h => h.toLowerCase() );
}

function scoreEntryStrict ( entry: CommandPaletteEntry, words: string[] ): number {
  const haystacks = haystacksFor( entry );
  let total = 0;
  for ( const word of words ) {
    const score = wordScoreAgainst( word, haystacks );
    if ( score === 0 ) return 0;
    total += score;
  }
  return total;
}

function rank ( scored: Array<{ entry: CommandPaletteEntry; score: number; }>, limit: number ): CommandPaletteEntry[] {
  return scored
    .sort( ( a, b ) => b.score - a.score )
    .slice( 0, limit )
    .map( s => s.entry );
}

/** Every word in the query must match something on the entry (label/group/keyword). */
export function searchEntries ( query: string, limit = 8 ): CommandPaletteEntry[] {
  const words = tokenize( query );
  if ( !words.length ) return COMMAND_PALETTE_ENTRIES.slice( 0, limit );

  const scored = COMMAND_PALETTE_ENTRIES
    .map( entry => ( { entry, score: scoreEntryStrict( entry, words ) } ) )
    .filter( s => s.score > 0 );

  return rank( scored, limit );
}

/** Every entry is an absolute https:// URL to another Taliferro app. */
export function navigateToEntry ( entry: CommandPaletteEntry ): void {
  if ( entry.newTab ) window.open( entry.path, '_blank', 'noopener' );
  else window.location.href = entry.path;
}
